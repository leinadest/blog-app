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
  try {
    const data = await User.create(userInfo);
    return res.json({ status: 'success', data });
  } catch (err) {
    err.code = 'database_error';
    throw err;
  }
});

exports.loginPost = asyncHandler(async (req, res) => {
  try {
    const data = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res.json({ status: 'success', data });
  } catch (err) {
    err.code = 'internal_server_error';
    throw err;
  }
});
