const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const Comment = require('../models/comment');

exports.commentsGet = asyncHandler(async (req, res) => {});

exports.commentPost = asyncHandler(async (req, res) => {});

exports.commentGet = asyncHandler(async (req, res) => {});

exports.commentPut = asyncHandler(async (req, res) => {});

exports.commentDelete = asyncHandler(async (req, res) => {});

exports.commentsOnPostGet = asyncHandler(async (req, res) => {});

exports.commentOnPostGet = asyncHandler(async (req, res) => {});

exports.commentsByUserGet = asyncHandler(async (req, res) => {});

exports.commentByUserGet = asyncHandler(async (req, res) => {});
