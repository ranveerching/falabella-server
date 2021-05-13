const PORT = 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const authRouter = require("./src/routes/auth");
const setRegisteredRouter = require("./src/routes/setRegistered");
const getRegisteredUsers = require("./src/routes/getRegisteredUsers");
const sendMailToUsers = require("./src/routes/sendMailsToUsers");

const { mongoDbConnectionString } = require("./src/utilities/utilities");

mongoose
  .connect(mongoDbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Successfully connected to Database!') })
  .catch(err => console.log(err));

mongoose.set("debug", true);

app.use(express.json());

app.all("*", function (req, res, next) {
  const responseSettings = {
    AccessControlAllowOrigin: req.headers.origin,
    AccessControlAllowHeaders:
      "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name",
    AccessControlAllowMethods: "POST, GET, PUT, DELETE, OPTIONS",
    AccessControlExposeHeaders: "x-auth-token",
    AccessControlAllowCredentials: true
  };

  res.header(
    "Access-Control-Allow-Credentials",
    responseSettings.AccessControlAllowCredentials
  );
  res.header(
    "Access-Control-Allow-Origin",
    responseSettings.AccessControlAllowOrigin
  );
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
      ? req.headers["access-control-request-headers"]
      : "x-requested-with"
  );
  res.header(
    "Access-Control-Expose-Headers",
    responseSettings.AccessControlExposeHeaders
  );
  res.header(
    "Access-Control-Allow-Methods",
    req.headers["access-control-request-method"]
      ? req.headers["access-control-request-method"]
      : responseSettings.AccessControlAllowMethods
  );

  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.use("/auth", authRouter);
app.use("/setRegistered", setRegisteredRouter);
app.use("/getRegisteredUsers", getRegisteredUsers);
app.use("/sendMailToUsers", sendMailToUsers);

app.listen(PORT);