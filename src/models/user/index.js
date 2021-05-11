const mongoose = require('mongoose');
const UserSchema = require('./user');

const User = mongoose.model('User', UserSchema);

module.exports = User;