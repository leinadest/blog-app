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

app.use((req, res, next) => {
  console.log(req.headers.authorization);
  next();
});

// Set up basic middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up routes

app.use('/api', apiRouter);

module.exports = app;
