const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const Post = require('../models/post');

exports.postsGet = asyncHandler(async (req, res) => {});

exports.postPost = asyncHandler(async (req, res) => {});

exports.postGet = asyncHandler(async (req, res) => {});

exports.postPut = asyncHandler(async (req, res) => {});

exports.postDelete = asyncHandler(async (req, res) => {});
