const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const { APIError } = require('../utils/helpers');
const Post = require('../models/post');
const User = require('../models/user');

/// SET-UP ///

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

/// HELPERS ///

function validateContent(content) {
  try {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const contentText = doc.body.textContent;
    return contentText.length > 0 && contentText.length <= 10000;
  } catch (err) {
    console.log(err);
  }
}

/// CONTROLLERS ///

exports.postsGet = asyncHandler(async (req, res) => {
  const { count, sort, order, query } = req.query;
  const posts = (
    await Post.find({ isPublished: true })
      .regex('title', query || '')
      .limit(count)
      .sort((sort && order && { [sort]: order }) || { likes: -1 })
      .populate({ path: 'user', select: 'username email' })
      .exec()
  ).map((post) => post.toObject({ virtuals: true }));
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
  if (!post.isPublished) {
    throw APIError(403, 'Post is not published', 'forbidden');
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
      populate: { path: 'user', select: 'username email' },
    })
    .exec();
  if (!user) {
    throw APIError(404, 'User not found', 'resource_not_found');
  }

  const post = user.posts.find((value) => value.id === req.params.postID);
  if (!post) {
    throw APIError(404, 'Post not found', 'resource_not_found');
  }
  if (!post.isPublished) {
    throw APIError(403, 'Post is not published', 'forbidden');
  }

  return res.json({ status: 'success', data: post });
});

exports.postsByClientGet = asyncHandler(async (req, res) => {
  const { count, sort, order, query } = req.query;
  const posts = (
    await Post.find({ _id: { $in: req.user.posts } })
      .regex('title', query || '')
      .limit(count)
      .sort((sort && order && { [sort]: order }) || { likes: -1 })
      .populate({ path: 'user', select: 'username email' })
      .exec()
  ).map((post) => post.toObject({ virtuals: true }));
  return res.json({ status: 'success', data: posts });
});

exports.postByClientGet = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postID)
    .populate({ path: 'user', select: 'username email' })
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username email' },
    })
    .exec();
  if (!post || post.user._id.toString() !== req.user.id) {
    throw APIError(
      404,
      `User does not have a post with ID ${req.params.postID}`,
      'resource_not_found',
    );
  }
  return res.json({
    status: 'success',
    data: post.toObject({ virtuals: true }),
  });
});

exports.reactedPostsByUserGet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userID)
    .populate({
      path: 'reactedPosts',
      populate: {
        path: 'postID',
        populate: { path: 'user', select: 'username email' },
      },
    })
    .populate({ path: 'comments', select: 'post' })
    .exec();
  if (!user) {
    throw APIError(404, 'User not found', 'resource_not_found');
  }

  const reactedPosts = user.reactedPosts.filter((reactedPost) => {
    let isValid = reactedPost.postID;
    if (reactedPost.reaction === 'comment') {
      isValid =
        isValid &&
        user.comments.find(
          (comment) => comment.post.toString() === reactedPost.postID.id,
        );
    }
    return isValid;
  });

  user.reactedPosts = reactedPosts;
  await user.save();

  const posts = reactedPosts.map((reactedPost) =>
    reactedPost.postID.toObject({ virtuals: true }),
  );

  return res.json({ status: 'success', data: posts });
});

exports.postCreatePost = [
  body('title')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Title must be within 500 characters')
    .escape(),
  body('content')
    .trim()
    .customSanitizer((value) => DOMPurify.sanitize(value))
    .custom(validateContent)
    .withMessage('Content must be within 1—10000 characters'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be boolean'),

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
    .customSanitizer((value) => DOMPurify.sanitize(value))
    .custom(validateContent)
    .withMessage('Content must be within 1—10000 characters'),
  body('isPublished')
    .optional()
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
    post.isPublished = req.body.isPublished ?? post.isPublished;

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

    let lastLikeOrDislike = null;
    user.reactedPosts.forEach((reactedPost, index) => {
      if (
        reactedPost.reaction === 'comment' ||
        reactedPost.postID.toString() !== post.id
      ) {
        return;
      }
      lastLikeOrDislike = reactedPost.reaction;
      post.likes += reactedPost.reaction === 'like' ? -1 : 1;
      user.reactedPosts.splice(index, index + 1);
    });

    if (lastLikeOrDislike !== req.body.action) {
      post.likes += req.body.action === 'like' ? 1 : -1;
      user.reactedPosts.push({ postID: post, reaction: req.body.action });
    }

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
