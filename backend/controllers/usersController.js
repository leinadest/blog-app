const asyncHandler = require('express-async-handler');

const User = require('../models/user');

exports.usersGet = asyncHandler(async (req, res) => {
  const users = await User.find({}, { username: 1, email: 1 }).exec();
  return res.json({ status: 'success', data: users });
});

exports.userProfileGet = asyncHandler(async (req, res) =>
  res.json({ status: 'success', data: req.user.toObject({ virtuals: true }) }),
);
