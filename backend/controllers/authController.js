const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { APIError } = require('../utils/helpers');
const User = require('../models/user');

exports.registerPost = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be 2—50 characters')
    .isAlphanumeric()
    .withMessage('Username must be fully alphanumeric')
    .escape(),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .custom(async (value) => {
      const existingEmail = await User.findOne({ email: value }).exec();
      if (existingEmail) throw new Error('Email must be unique');
    })
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage('Password must be between 8 and 50 characters')
    .isStrongPassword({
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must contain at least one number, one uppercase and lowercase character, and one symbol',
    )
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length) throw APIError(400, errors[0].msg, 'invalid_input');

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    const userInfo = {
      username: req.body.username,
      email: req.body.email,
      password: hash,
      salt,
    };

    const data = await User.create(userInfo);
    return res.json({ status: 'success', data });
  }),
];

exports.loginPost = asyncHandler(async (req, res) => {
  const data = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return res.json({ status: 'success', data });
});
