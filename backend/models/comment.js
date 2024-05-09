const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  content: { type: String, required: true, maxLength: 1000 },
  time: { type: Date, default: Date.now },
});

CommentSchema.virtual('formattedTime').get(function () {
  return DateTime.fromJSDate(this.time).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model('Comment', CommentSchema);
