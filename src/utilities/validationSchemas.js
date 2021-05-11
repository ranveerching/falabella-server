const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signupSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const registeredSchema = Joi.object({
  _id: Joi.string().required(),
});

const setAdminSchema = Joi.object({
  _id: Joi.string().required(),
});

const sendMailSchema = Joi.object({
  email: Joi.array().items(Joi.string()).min(1).required(),
  subject: Joi.string().required(),
  emailContent: Joi.string().required(),
});

module.exports = {
  loginSchema,
  signupSchema,
  registeredSchema,
  setAdminSchema,
  sendMailSchema,
};