const router = require("express").Router();

const User = require("../models/user");

const authMiddleware = require('../middlewares/auth');
const isAdminMiddleware = require("../middlewares/isAdmin");

router.get('/', [authMiddleware, isAdminMiddleware], async (_, res) => {
  try {
    const users = await User.find({ isRegistered: true, isAdmin: false });

    return res.status(200).send(users);
  } catch (err) {
    return status(500).send(err);
  }
});

module.exports = router;