const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.usersGet = asyncHandler(async (req, res) =>
  res.json(await User.find().exec()),
);

exports.userPost = asyncHandler(async (req, res) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  const userInfo = {
    username: req.body.username,
    email: req.body.email,
    password: hash,
    salt,
  };
  res.json(await User.create(userInfo));
});

exports.userGet = asyncHandler(async (req, res) =>
  res.json(await User.findById(req.params.userID)),
);

exports.userPut = asyncHandler(async (req, res) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  const userInfo = {
    username: req.body.username,
    email: req.body.email,
    password: hash,
    salt,
    _id: req.params.userID,
  };
  res.json(await User.findByIdAndUpdate(req.params.userID, userInfo));
});

exports.userDelete = asyncHandler(async (req, res) =>
  res.json(await User.findByIdAndDelete(req.params.userID)),
);
