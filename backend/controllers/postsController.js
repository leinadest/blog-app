const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const Post = require('../models/post');
const User = require('../models/user');

exports.postsGet = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find().exec();
    return res.json({ status: 'success', data: posts });
  } catch (err) {
    err.code = 'database_error';
    throw err;
  }
});

exports.postPost = asyncHandler(async (req, res) => {
  const postInfo = {
    user: req.user,
    title: req.body.title,
    content: req.body.content,
    isPublished: req.body.isPublished,
  };
  try {
    const post = await Post.create(postInfo);
    await User.findByIdAndUpdate(req.user._id, {
      posts: [...req.user.posts, post],
    });
    return res.json({ status: 'success', data: post });
  } catch (err) {
    err.code = 'database_error';
    throw err;
  }
});

exports.postGet = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID).exec();
    if (!post)
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
        code: 'resource_not_found',
      });
    return res.json({ status: 'success', data: post });
  } catch (err) {
    err.code = 'database_error';
    throw err;
  }
});

exports.postPut = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postID).exec();
  if (!post)
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
      code: 'resource_not_found',
    });
  const update = {
    user: req.user,
    title: req.body.title,
    content: req.body.content,
    isPublished: req.body.isPublished,
    _id: req.params.postID,
  };
  try {
    const data = await Post.findByIdAndUpdate(req.params.postID, update);
    return res.json({ status: 'success', data });
  } catch (err) {
    err.code = 'database_error';
    throw err;
  }
});

exports.postDelete = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postID).exec();
  if (!post)
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
      code: 'resource_not_found',
    });
  try {
    const data = await Post.findByIdAndDelete(req.params.postID);
    await User.findByIdAndUpdate(req.user._id, {
      posts: req.user.posts.filter(
        (value) => value._id.toString() !== post._id.toString(),
      ),
    });
    return res.json({ status: 'success', data });
  } catch (err) {
    err.code = 'database_error';
    throw err;
  }
});

exports.postsByUserGet = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userID)
      .populate('posts')
      .exec();
    if (!user)
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        code: 'resource_not_found',
      });
    return res.json({ status: 'success', data: user.posts });
  } catch (err) {
    err.code = 'database_error';
    throw err;
  }
});

exports.postByUserGet = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userID)
      .populate('posts')
      .exec();
    if (!user)
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        code: 'resource_not_found',
      });
    const post = user.posts.find((value) => value.id === req.params.postID);
    if (!post)
      return res.status(404).json({
        status: 'error',
        message: 'Post not found',
        code: 'resource_not_found',
      });
    return res.json({ status: 'success', data: post });
  } catch (err) {
    err.code = 'database_error';
    throw err;
  }
});
