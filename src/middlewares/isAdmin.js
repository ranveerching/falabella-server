const User = require('../models/user');

module.exports = async function (req, res, next) {
  try {
    const adminUser = await User.findOne({ _id: req.loggedInUserId, isAdmin: true });

    if (!adminUser) {
      return res.status(401).send('You are not allowed to access the resource!');
    }
  } catch (err) {
    return res.status(401).send('Invalid session!');
  }
  next();
};