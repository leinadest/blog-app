const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.registerPost = asyncHandler(async (req, res) => {});

exports.loginPost = asyncHandler(async (req, res) => {});

exports.logoutPost = asyncHandler(async (req, res) => {});
