const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  },

  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  isRegistered: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = UserSchema;