const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const { APIError } = require('../utils/helpers');
const User = require('../models/user');

exports.usersGet = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}, 'username').exec();
    return res.json({ status: 'success', data: users });
  } catch (err) {
    throw APIError(err.status, err.message, 'database_error');
  }
});

exports.userGet = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userID).exec();
    if (!user) throw APIError(404, 'User not found', 'resource_not_found');
    return res.json({ status: 'success', data: user });
  } catch (err) {
    throw APIError(err.status, err.message, 'database_error');
  }
});
