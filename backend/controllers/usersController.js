const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.usersGet = asyncHandler(async (req, res) =>
  res.json(await User.find().exec()),
);

exports.userGet = asyncHandler(async (req, res) =>
  res.json(await User.findById(req.params.userID)),
);
