const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: {
    type: String,
    default: 'Untitled Post',
    maxLength: 500,
  },
  content: { type: String, required: true, maxLength: 10000 },
  time: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment' },
  likes: { type: Number, default: 0 },
});

PostSchema.virtual('formattedTime').get(function () {
  return DateTime.fromJSDate(this.time).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model('Post', PostSchema);
