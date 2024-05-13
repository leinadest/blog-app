const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const { APIError } = require('../utils/helpers');
const Post = require('../models/post');
const User = require('../models/user');

exports.postsGet = asyncHandler(async (req, res) => {
  const posts = (
    await Post.find()
      .sort('time')
      .populate({ path: 'user', select: 'username email' })
      .exec()
  )
    .filter((post) => post.isPublished)
    .map((post) => post.toObject({ virtuals: true }));
  return res.json({ status: 'success', data: posts });
});

exports.postGet = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postID)
    .populate({ path: 'user', select: 'username email' })
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username email' },
    })
    .exec();
  if (!post) {
    throw APIError(404, 'Post not found', 'resource_not_found');
  }
  return res.json({
    status: 'success',
    data: post.toObject({ virtuals: true }),
  });
});

exports.postsByUserGet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userID).populate('posts').exec();
  if (!user) {
    throw APIError(404, 'User not found', 'resource_not_found');
  }
  return res.json({ status: 'success', data: user.posts });
});

exports.postByUserGet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userID)
    .populate('posts')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username' },
    })
    .exec();
  if (!user) {
    throw APIError(404, 'User not found', 'resource_not_found');
  }

  const post = user.posts.find((value) => value.id === req.params.postID);
  if (!post) {
    throw APIError(404, 'Post not found', 'resource_not_found');
  }

  return res.json({ status: 'success', data: post });
});

exports.postsByClientGet = asyncHandler(async (req, res) => {
  const posts = await Post.find({ _id: { $in: req.user.posts } }).exec();
  return res.json({ status: 'success', data: posts });
});

exports.postByClientGet = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postID)
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username' },
    })
    .exec();
  if (!post || post.user.toString() !== req.user.id) {
    throw APIError(
      404,
      `User does not have a post with ID ${req.params.postID}`,
      'resource_not_found',
    );
  }
  return res.json({ status: 'success', data: post });
});

exports.postCreatePost = [
  body('title')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Title must be within 500 characters')
    .escape(),
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be within 1—10000 characters')
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length) throw APIError(400, errors[0].msg, 'invalid_input');

    const postInfo = {
      user: req.user,
      title: req.body.title || undefined,
      content: req.body.content,
      isPublished: req.body.isPublished,
    };

    const post = await Post.create(postInfo);
    await User.findByIdAndUpdate(req.user._id, {
      posts: [...req.user.posts, post],
    });
    return res.json({
      status: 'success',
      data: post,
    });
  }),
];

exports.postEditPut = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Title must be within 500 characters')
    .escape(),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be within 1—10000 characters')
    .escape(),
  body('isPublished')
    .optional()
    .trim()
    .isBoolean()
    .withMessage('isPublished must be boolean'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    const post = await Post.findById(req.params.postID).exec();

    if (errors.length) {
      throw APIError(400, errors[0].msg, 'invalid_input');
    }
    if (!post) {
      throw APIError(404, 'Post not found', 'resource_not_found');
    }
    if (post.user.toString() !== req.user.id) {
      throw APIError(
        403,
        'User does not have permission to update this post',
        'forbidden',
      );
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.isPublished = req.body.isPublished || post.isPublished;

    const data = await post.save();
    return res.json({ status: 'success', data });
  }),
];

exports.postReactPut = [
  body('action')
    .trim()
    .matches(/^(like|dislike)$/)
    .withMessage("Action must be either 'like' or 'dislike'"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    const [post, user] = await Promise.all([
      Post.findById(req.params.postID).exec(),
      User.findById(req.user._id).exec(),
    ]);

    if (errors.length) {
      throw APIError(400, errors[0].msg, 'invalid_input');
    }
    if (!post) {
      throw APIError(404, 'Post not found', 'resource_not_found');
    }
    if (!post.isPublished && req.user.id !== post.user.toString()) {
      throw APIError(403, 'Post is not published', 'forbidden');
    }
    if (req.user._id.toString() === post.user.toString()) {
      throw APIError(
        403,
        'User does not have permission for this action',
        'forbidden',
      );
    }

    user.reactedPosts.forEach((reactedPost, index) => {
      if (reactedPost.postID.toString() !== post.id) return;
      post.likes += reactedPost.reaction === 'like' ? -1 : 1;
      user.reactedPosts.splice(index, index + 1);
    });

    post.likes += req.body.action === 'like' ? 1 : -1;
    user.reactedPosts.push({ postID: post, reaction: req.body.action });

    const data = await Promise.all([post.save(), user.save()]);
    res.json({ status: 'success', data });
  }),
];

exports.postDelete = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postID).exec();

  if (!post) {
    throw APIError(404, 'Post not found', 'resource_not_found');
  }
  if (post.user._id.toString() !== req.user._id.toString()) {
    throw APIError(
      403,
      'User does not have permission to delete this post',
      'forbidden',
    );
  }

  const data = await Post.findByIdAndDelete(req.params.postID);
  await User.findByIdAndUpdate(req.user._id, {
    posts: req.user.posts.filter((postId) => postId.toString() !== post.id),
  });
  return res.json({ status: 'success', data });
});
