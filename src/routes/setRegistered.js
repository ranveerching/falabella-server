const router = require("express").Router();
const path = require("path");
const { EmailTemplate } = require('email-templates');

const User = require("../models/user");
const { registeredSchema } = require("../utilities/validationSchemas");
const { transporter } = require("../utilities/utilities");
const authMiddleware = require('../middlewares/auth');

router.put("/", authMiddleware, async (req, res) => {
  const reqBody = { ...req.body };

  const result = registeredSchema.validate({ ...reqBody }, { abortEarly: false });

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
    const updatedUser = await User.findOneAndUpdate({
      _id: reqBody._id
    },
      {
        $set: { isRegistered: true },
      },
      {
        new: true
      }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'User attached with requested id not found!' });
    }

    let templateDir = path.join(__dirname, '../', 'templates', 'welcome');

    const welcomeTemplate = new EmailTemplate(templateDir);

    welcomeTemplate.render({
      name: updatedUser.fullName
    }, (err, welcomeHtml) => {
      if (err) {
        console.log('Mail template render error!');
      }

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: updatedUser.email,
        subject: "Welcome to Falabella!",
        html: welcomeHtml.html,
        headers: {
          priority: "high",
        }
      };

      transporter.sendMail({ ...mailOptions })
        .then(() => console.log('Mail send successfully!'))
        .catch(err => console.log(err));
    });

    return res.status(200).send(updatedUser);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;