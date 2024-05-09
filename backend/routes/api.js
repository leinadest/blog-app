const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const postController = require('../controllers/postsController');
const commentsController = require('../controllers/commentsController');
const usersController = require('../controllers/usersController');

// Handle post request for registration
router.post('/register', authController.registerPost);

// Handle post request for login
router.post('/login', authController.loginPost);

// Handle post request for logout
router.post('/logout', authController.logoutPost);

// Handle get request for all posts
router.get('/posts', postController.postsGet);

// Handle post request for a post
router.post('/posts', postController.postPost);

// Handle get request for a post
router.get('/posts/:postID', postController.postGet);

// Handle put request for a post
router.put('/posts/:postID', postController.postPut);

// Handle delete request for a post
router.delete('/posts/:postID', postController.postDelete);

// Handle get request for a post's comments
router.get('/posts/:postID/comments', commentsController.commentsGet);

// Handle post request on a post for a comment
router.post('/posts/:postID/comments', commentsController.commentPost);

// Handle get request on a post for a comment
router.get('/posts/:postID/comments/:commentID', commentsController.commentGet);

// Handle put request on a post for a comment
router.put('/posts/:postID/comments/:commentID', commentsController.commentPut);

// Handle delete request on a post for a comment
router.delete(
  '/posts/:postID/comments/:commentID',
  commentsController.commentDelete,
);

// Handle get request for all users
router.get('/users', usersController.usersGet);

// Handle post request for a user
router.post('/users', usersController.userPost);

// Handle get request for a user
router.get('/users/:userID', usersController.userGet);

// Handle put request for a user
router.put('/users/:userID', usersController.userPut);

// Handle delete request for a user
router.delete('/users/:userID', usersController.userDelete);

module.exports = router;
