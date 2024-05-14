const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');
const commentsController = require('../controllers/commentsController');
const usersController = require('../controllers/usersController');
const { authenticate } = require('../utils/helpers');

/// AUTHENTICATION ROUTES ///

// Handle POST request to register
router.post('/register', authController.registerPost);

// Handle POST request to log in
router.post('/login', authenticate('json'), authController.loginPost);

/// POST ROUTES ///

// Handle GET request to fetch all posts
router.get('/posts', postsController.postsGet);

// Handle GET request to fetch a post
router.get('/posts/:postID', postsController.postGet);

// Handle GET request to fetch all posts by a user
router.get('/users/:userID/posts', postsController.postsByUserGet);

// Handle GET request to fetch a post by a user
router.get('/users/:userID/posts/:postID', postsController.postByUserGet);

// Handle POST request to create a post
router.post('/posts', authenticate('jwt'), postsController.postCreatePost);

// Handle PUT request to edit a post
router.put('/posts/:postID', authenticate('jwt'), postsController.postEditPut);

// Handle PUT request to like/dislike a post
router.put(
  '/posts/:postID/react',
  authenticate('jwt'),
  postsController.postReactPut,
);

// Handle DELETE request to delete a post
router.delete(
  '/posts/:postID',
  authenticate('jwt'),
  postsController.postDelete,
);

/// COMMENT ROUTES ///

// Handle GET request to fetch all comments on a post
router.get('/posts/:postID/comments', commentsController.commentsOnPostGet);

// Handle GET request to fetch a comment on a post
router.get(
  '/posts/:postID/comments/:commentID',
  commentsController.commentOnPostGet,
);

// Handle GET request to fetch all comments by a user
router.get('/users/:userID/comments', commentsController.commentsByUserGet);

// Handle GET request to fetch a comment by a user
router.get(
  '/users/:userID/comments/:commentID',
  commentsController.commentByUserGet,
);

// Handle POST request to create a comment on a post
router.post(
  '/posts/:postID/comments',
  authenticate('jwt'),
  commentsController.commentCreatePost,
);

// Handle PUT request to edit a comment on a post
router.put(
  '/posts/:postID/comments/:commentID',
  authenticate('jwt'),
  commentsController.commentEditPut,
);

// Handle PUT request to like/dislike a comment on a post
router.put(
  '/posts/:postID/comments/:commentID/react',
  authenticate('jwt'),
  commentsController.commentReactPut,
);

// Handle DELETE request to delete a comment on a post
router.delete(
  '/posts/:postID/comments/:commentID',
  authenticate('jwt'),
  commentsController.commentDelete,
);

/// USER ROUTES ///

// Handle GET request to fetch all users
router.get('/users', usersController.usersGet);

// Handle GET request to fetch a user
router.get('/users/:userID', authenticate('jwt'), usersController.userGet);

module.exports = router;
