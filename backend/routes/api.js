const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');
const commentsController = require('../controllers/commentsController');
const usersController = require('../controllers/usersController');

// Helper functions

function authenticate(strategy) {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err)
        return res.status(500).json({
          status: 'error',
          message: 'An error occurred during authentication',
          code: 'internal_server_error',
        });
      if (!user)
        return res.status(401).json({
          status: 'error',
          message: info.message,
          code: 'unauthorized',
        });
      req.logIn(user, { session: false });
      next();
    })(req, res, next);
  };
}

/// AUTHENTICATION ROUTES ///

// Handle post request to register
router.post('/register', authController.registerPost);

// Handle post request to log in
router.post('/login', authenticate('json'), authController.loginPost);

/// POST ROUTES ///

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
router.post('/posts', authenticate('jwt'), postsController.postPost);

// Handle post request to create a comment on a post
router.post(
  '/posts/:postID/comments',
  authenticate('jwt'),
  commentsController.commentPost,
);

// Handle put request to update a post
router.put('/posts/:postID', authenticate('jwt'), postsController.postPut);

// Handle put request to update a comment on a post
router.put(
  '/posts/:postID/comments/:commentID',
  authenticate('jwt'),
  commentsController.commentPut,
);

// Handle delete request to delete a post
router.delete(
  '/posts/:postID',
  authenticate('jwt'),
  postsController.postDelete,
);

// Handle delete request to delete a comment on a post
router.delete(
  '/posts/:postID/comments/:commentID',
  authenticate('jwt'),
  commentsController.commentDelete,
);

/// USER ROUTES ///

// Handle get request to fetch all users
router.get('/users', authenticate('jwt'), usersController.usersGet);

// Handle get request to fetch a user
router.get('/users/:userID', authenticate('jwt'), usersController.userGet);

// Handle get request to fetch all posts by a user
router.get('/users/:userID/posts', postsController.postsByUserGet);

// Handle get request to fetch a post by a user
router.get('/users/:userID/posts/:postID', postsController.postByUserGet);

// Handle get request to fetch all comments by a user
router.get('/users/:userID/comments', commentsController.commentsByUserGet);

// Handle get request to fetch a comment by a user
router.get(
  '/users/:userID/comments/:commentID',
  commentsController.commentByUserGet,
);

module.exports = router;
