const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');
const commentsController = require('../controllers/commentsController');
const usersController = require('../controllers/usersController');

// Handle post request to register
router.post('/register', authController.registerPost);

// Handle post request to log in
router.post(
  '/login',
  passport.authenticate('json', { session: false }),
  authController.loginPost,
);

// Handle get request to fetch all posts
router.get('/posts', postsController.postsGet);

// Handle get request to fetch a post
router.get('/posts/:postID', postsController.postGet);

// Handle get request to fetch all comments on a post
router.get('/posts/:postID/comments', commentsController.commentsOnPostGet);

// Handle get request to fetch a comment on a post
router.get(
  '/posts/:postID/comments/:commentID',
  commentsController.commentOnPostGet,
);

// Handle post request to create a post
router.post(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  postsController.postPost,
);

// Handle post request to create a comment on a post
router.post(
  '/posts/:postID/comments',
  passport.authenticate('jwt', { session: false }),
  commentsController.commentPost,
);

// Handle put request to update a post
router.put(
  '/posts/:postID',
  passport.authenticate('jwt', { session: false }),
  postsController.postPut,
);

// Handle put request to update a comment on a post
router.put(
  '/posts/:postID/comments/:commentID',
  passport.authenticate('jwt', { session: false }),
  commentsController.commentPut,
);

// Handle delete request to delete a post
router.delete(
  '/posts/:postID',
  passport.authenticate('jwt', { session: false }),
  postsController.postDelete,
);

// Handle delete request to delete a comment on a post
router.delete(
  '/posts/:postID/comments/:commentID',
  passport.authenticate('jwt', { session: false }),
  commentsController.commentDelete,
);

// Handle get request to fetch all users
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  usersController.usersGet,
);

// Handle get request to fetch a user
router.get(
  '/users/:userID',
  passport.authenticate('jwt', { session: false }),
  usersController.userGet,
);

// Handle get request to fetch all posts by a user
router.get(
  '/users/:userID/posts',
  passport.authenticate('jwt', { session: false }),
  postsController.postsByUserGet,
);

// Handle get request to fetch a post by a user
router.get(
  '/users/:userID/posts/:postID',
  passport.authenticate('jwt', { session: false }),
  postsController.postByUserGet,
);

// Handle get request to fetch all comments by a user
router.get(
  '/users/:userID/comments',
  passport.authenticate('jwt', { session: false }),
  commentsController.commentsByUserGet,
);

// Handle get request to fetch a comment by a user
router.get(
  '/users/:userID/comments/:commentID',
  passport.authenticate('jwt', { session: false }),
  commentsController.commentByUserGet,
);

module.exports = router;
