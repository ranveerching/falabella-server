const mailer = require("nodemailer");

mongoURI = "mongodb://localhost:27017/demo";
const mongoDbConnectionString = process.env.MONGODB_URI || mongoURI;

const transporter = mailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASSWORD,
  }
});

module.exports = {
  mongoDbConnectionString,
  transporter,
};