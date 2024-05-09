const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.registerPost = asyncHandler(async (req, res) => {
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

exports.loginPost = asyncHandler(async (req, res) =>
  res.json(
    jwt.sign({ user: req.user }, process.env.JWT_SECRET, { expiresIn: '1d' }),
  ),
);
