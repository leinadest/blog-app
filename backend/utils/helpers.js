const passport = require('passport');

// Functions

function APIError(status, message, code) {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  return err;
}

// Middleware

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

module.exports = { APIError, authenticate };
