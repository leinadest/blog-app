require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const dbString =
  process.env.NODE_ENV === 'production'
    ? process.env.DB_STRING
    : process.env.DEV_DB_STRING;

mongoose
  .set('strictQuery', false)
  .connect(dbString)
  .catch((err) => console.log(err));

const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

module.exports = app;
