const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  posts: { type: [mongoose.Schema.Types.ObjectId], ref: 'Post' },
  comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment' },
  reactedPosts: {
    type: [
      {
        postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        reaction: { type: String, enum: ['like', 'dislike'], required: true },
      },
    ],
    default: [],
  },
  reactedComments: {
    type: [
      {
        commentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
        reaction: { type: String, enum: ['like', 'dislike'], required: true },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model('User', UserSchema);
