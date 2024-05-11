const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const { APIError } = require('../utils/helpers');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

exports.commentPost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be within 1—2000 characters')
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length) throw APIError(400, errors[0].msg, 'invalid_input');

    try {
      const user = await User.findById(req.user._id).exec();
      const post = await Post.findById(req.params.postID).exec();
      if (!post) throw APIError(404, 'Post not found', 'resource_not_found');

      const commentInfo = {
        user,
        post,
        content: req.body.content,
      };
      const comment = new Comment(commentInfo);

      post.comments.push(comment.id);
      user.comments.push(comment.id);

      const data = await Promise.all([
        post.save(),
        user.save(),
        comment.save(),
      ]);
      return res.json({ status: 'success', data: data[2] });
    } catch (err) {
      throw APIError(err.status, err.message, 'database_error');
    }
  }),
];

exports.commentPut = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be within 1—2000 characters')
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length) throw APIError(400, errors[0].msg, 'invalid_input');

    try {
      const comment = await Comment.findById(req.params.commentID).exec();
      const post = await Post.findById(req.params.postID).exec();

      if (!post) throw APIError(404, 'Post not found', 'resource_not_found');
      if (!comment)
        throw APIError(404, 'Comment not found', 'resource_not_found');
      if (comment.user.toString() !== req.user._id.toString())
        throw APIError(
          401,
          'User is unauthorized to update this comment',
          'unauthorized',
        );

      comment.content = req.body.content || comment.content;
      comment.likes = req.body.likes || comment.likes;

      const data = await comment.save();
      return res.json({ status: 'success', data });
    } catch (err) {
      throw APIError(err.status, err.message, 'database_error');
    }
  }),
];

exports.commentDelete = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const comment = await Comment.findById(req.params.commentID).exec();
    const post = await Post.findById(comment.post).exec();

    if (!post) throw APIError(404, 'Post not found', 'resource_not_found');
    if (!comment)
      throw APIError(404, 'Comment not found', 'resource_not_found');
    if (comment.user.toString() !== req.user._id.toString())
      throw APIError(
        401,
        'User is unauthorized to delete this comment',
        'unauthorized',
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
  } catch (err) {
    throw APIError(err.status, err.message, 'database_error');
  }
});

exports.commentsOnPostGet = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID)
      .populate('comments')
      .exec();
    if (!post) throw APIError(404, 'Post not found', 'resource_not_found');
    return res.json({ status: 'success', data: post.comments });
  } catch (err) {
    throw APIError(err.status, err.message, 'database_error');
  }
});

exports.commentOnPostGet = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID)
      .populate('comments')
      .exec();
    if (!post) throw APIError(404, 'Post not found', 'resource_not_found');

    const comment = post.comments.find(
      (value) => value._id.toString() === req.params.commentID,
    );
    if (!comment)
      throw APIError(404, 'Comment not found', 'resource_not_found');

    return res.json({ status: 'success', data: comment });
  } catch (err) {
    throw APIError(err.status, err.message, 'database_error');
  }
});

exports.commentsByUserGet = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userID)
      .populate('comments')
      .exec();
    if (!user) throw APIError(404, 'User not found', 'resource_not_found');
    return res.json({ status: 'success', data: user.comments });
  } catch (err) {
    throw APIError(err.status, err.message, 'database_error');
  }
});

exports.commentByUserGet = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userID)
      .populate('comments')
      .exec();
    if (!user) throw APIError(404, 'User not found', 'resource_not_found');

    const comment = user.comments.find(
      (value) => value._id.toString() === req.params.commentID,
    );
    if (!comment)
      throw APIError(404, 'Comment not found', 'resource_not_found');

    return res.json({ status: 'success', data: comment });
  } catch (err) {
    throw APIError(err.status, err.message, 'database_error');
  }
});
