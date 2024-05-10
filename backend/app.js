require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const apiRouter = require('./routes/api');

const app = express();

// Set up mongoose connection

const dbString =
  process.env.NODE_ENV === 'production'
    ? process.env.DB_STRING
    : process.env.DEV_DB_STRING;

mongoose
  .set('strictQuery', false)
  .connect(dbString)
  .catch((err) => console.log(err));

// Set up passport authentication

require('./config/passport');

// Set up basic middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up routes

app.use('/api', apiRouter);

// Handle errors

app.use((req, res) =>
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    code: 'resource_not_found',
  }),
);

app.use((err, req, res, next) => {
  if (err) {
    return res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Unexpected server error',
      code: err.code,
    });
  }
  next();
});

module.exports = app;
