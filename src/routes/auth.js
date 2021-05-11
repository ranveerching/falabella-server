const router = require("express").Router();
const jwt = require("jsonwebtoken");
const isEqual = require("lodash/isEqual");
const crypto = require("crypto");

const User = require("../models/user");

const { loginSchema, signupSchema } = require("../utilities/validationSchemas");

router.post("/login", async (req, res) => {
  const reqBody = { ...req.body };

  const result = loginSchema.validate({ ...reqBody }, { abortEarly: false });

  if (result.error) {
    let message = [];
    result.error.details.map(detail => {
      message.push(detail.message);
    });
    return res.status(400).send({
      message: message.join(", ")
    });
  }

  try {
    const user = await User.findOne({ email: reqBody.email });

    if (!user) {
      return res.status(404).send({ message: 'User attached with requested email not found!' });
    }

    const hash = crypto
      .pbkdf2Sync(
        reqBody.password,
        process.env.PASSWORD_SALT,
        1000,
        64,
        `sha512`
      )
      .toString(`hex`);

    if (isEqual(user.password, hash)) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY);

      res.header("x-auth-token", token);

      const updatedUser = {};

      Object.keys(user._doc).map(key => {
        if (key !== "password") {
          updatedUser[key] = user[key];
        }
      });

      return res.status(200).send(updatedUser);
    } else {
      return res.status(404).send({ message: "Password is incorrect!" });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/signup", async (req, res) => {
  const reqBody = { ...req.body };

  const result = signupSchema.validate({ ...reqBody }, { abortEarly: false });

  if (result.error) {
    let message = [];
    result.error.details.map(detail => {
      message.push(detail.message);
    });
    return res.status(400).send({
      message: message.join(", ")
    });
  }

  try {
    const password = crypto
      .pbkdf2Sync(
        reqBody.password,
        process.env.PASSWORD_SALT,
        1000,
        64,
        `sha512`
      )
      .toString(`hex`);

    let user = new User({
      ...reqBody,
      password: password,
    });

    const existedUser = await User.findOne({ email: reqBody?.email });

    if (existedUser) {
      return res.status(403).send({ message: "User already registered with this email! Please try with other email." });
    }

    user = await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY);

    res.header("x-auth-token", token);

    const updatedUser = {};

    Object.keys(user._doc).map(key => {
      if (key !== "password") {
        updatedUser[key] = user[key];
      }
    });

    return res.status(200).send(updatedUser);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
