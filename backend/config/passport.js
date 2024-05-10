require('dotenv').config();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const JsonStrategy = require('passport-json').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user');

// Username-password login authentication set-up

passport.use(
  new JsonStrategy(async (username, password, done) => {
    try {
      const userMatch = await User.findOne({ username }).exec();
      if (!userMatch) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const passwordMatch = await bcrypt.compare(password, userMatch.password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, userMatch);
    } catch (err) {
      return done(err);
    }
  }),
);

// JWT authentication set-up

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.user._id).exec();
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }),
);

module.exports = passport;
