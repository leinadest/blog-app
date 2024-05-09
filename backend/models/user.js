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
});

module.exports = mongoose.model('User', UserSchema);
