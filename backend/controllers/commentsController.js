const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const { APIError } = require('../utils/helpers');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

exports.commentsOnPostGet = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postID)
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username email' },
    })
    .exec();
  if (!post) throw APIError(404, 'Post not found', 'resource_not_found');
  post.comments = post.comments.map((comment) =>
    comment.toObject({ virtuals: true }),
  );
  return res.json({ status: 'success', data: post.comments });
});

exports.commentOnPostGet = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postID)
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username email' },
    })
    .exec();
  if (!post) throw APIError(404, 'Post not found', 'resource_not_found');

  const comment = post.comments.find(
    (value) => value._id.toString() === req.params.commentID,
  );
  if (!comment) throw APIError(404, 'Comment not found', 'resource_not_found');

  return res.json({
    status: 'success',
    data: comment.toObject({ virtuals: true }),
  });
});

exports.commentsByUserGet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userID)
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username email' },
    })
    .exec();
  if (!user) throw APIError(404, 'User not found', 'resource_not_found');
  user.comments = user.comments.map((comment) =>
    comment.toObject({ virtuals: true }),
  );
  return res.json({ status: 'success', data: user.comments });
});

exports.commentByUserGet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userID)
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username email' },
    })
    .exec();
  if (!user) throw APIError(404, 'User not found', 'resource_not_found');

  const comment = user.comments.find(
    (value) => value._id.toString() === req.params.commentID,
  );
  if (!comment) throw APIError(404, 'Comment not found', 'resource_not_found');

  return res.json({
    status: 'success',
    data: comment.toObject({ virtuals: true }),
  });
});

exports.commentCreatePost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be within 1—2000 characters')
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    const user = await User.findById(req.user._id).exec();
    const post = await Post.findById(req.params.postID).exec();

    if (errors.length) throw APIError(400, errors[0].msg, 'invalid_input');
    if (!post) throw APIError(404, 'Post not found', 'resource_not_found');

    const commentInfo = {
      user,
      post,
      content: req.body.content,
    };
    const comment = new Comment(commentInfo);

    post.comments.push(comment.id);
    user.comments.push(comment.id);

    const data = await Promise.all([post.save(), user.save(), comment.save()]);
    return res.json({ status: 'success', data: data[2] });
  }),
];

exports.commentEditPut = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be within 1—2000 characters')
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    const comment = await Comment.findById(req.params.commentID).exec();
    const post = await Post.findById(req.params.postID).exec();

    if (errors.length) {
      throw APIError(400, errors[0].msg, 'invalid_input');
    }
    if (!post) {
      throw APIError(404, 'Post not found', 'resource_not_found');
    }
    if (!comment) {
      throw APIError(404, 'Comment not found', 'resource_not_found');
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      throw APIError(
        403,
        'User does not have permission to update this comment',
        'forbidden',
      );
    }

    comment.content = req.body.content || comment.content;

    const data = await comment.save();
    return res.json({ status: 'success', data });
  }),
];

exports.commentReactPut = [
  body('action')
    .trim()
    .matches(/^(like|dislike)$/)
    .withMessage("Action must be either 'like' or 'dislike'"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    const [comment, user] = await Promise.all([
      Comment.findById(req.params.commentID).exec(),
      User.findById(req.user._id).exec(),
    ]);

    if (errors.length) {
      throw APIError(400, errors[0].msg, 'invalid_input');
    }
    if (!comment) {
      throw APIError(404, 'Comment not found', 'resource_not_found');
    }
    if (req.user._id.toString() === comment.user.toString()) {
      throw APIError(
        403,
        'User does not have permission for this action',
        'forbidden',
      );
    }

    user.reactedComments.forEach((reactedComment, index) => {
      if (reactedComment.commentID.toString() !== comment.id) return;
      comment.likes += reactedComment.reaction === 'like' ? -1 : 1;
      user.reactedComments.splice(index, index + 1);
    });

    comment.likes += req.body.action === 'like' ? 1 : -1;
    user.reactedComments.push({
      commentID: comment,
      reaction: req.body.action,
    });

    const data = await Promise.all([comment.save(), user.save()]);
    res.json({ status: 'success', data });
  }),
];

exports.commentDelete = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  const comment = await Comment.findById(req.params.commentID).exec();
  const post = await Post.findById(comment.post).exec();

  if (!post) throw APIError(404, 'Post not found', 'resource_not_found');
  if (!comment) throw APIError(404, 'Comment not found', 'resource_not_found');
  if (comment.user.toString() !== req.user._id.toString())
    throw APIError(
      403,
      'User does not have permission to delete this comment',
      'forbidden',
    );

  post.comments = post.comments.filter(
    (value) => value._id.toString() !== comment.id,
  );
  user.comments = user.comments.filter(
    (value) => value._id.toString() !== comment.id,
  );
  await Promise.all([post.save(), user.save()]);

  const data = await Comment.findByIdAndDelete(comment._id);
  return res.json({ status: 'success', data });
});
