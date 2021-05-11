const PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();

const authRouter = require("./src/routes/auth");
const setAdminRouter = require("./src/routes/setAdmin");
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
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Expose-Headers",
    "x-auth-token"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const corsWhiteList = [
  'http://localhost:3000',
  'http://localhost:3009',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}));

app.use("/auth", authRouter);
app.use("/setAdmin", setAdminRouter);
app.use("/setRegistered", setRegisteredRouter);
app.use("/getRegisteredUsers", getRegisteredUsers);
app.use("/sendMailToUsers", sendMailToUsers);

app.listen(PORT, console.log(`Running on port ${PORT}`));