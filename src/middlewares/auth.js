const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(404).send('Auth token missing!');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.loggedInUserId = user._id;
  } catch (err) {
    return res.status(401).send('Invalid session!');
  }
  next();
};