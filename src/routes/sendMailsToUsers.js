const router = require("express").Router();
const path = require("path");
const { EmailTemplate } = require('email-templates');

const { transporter } = require("../utilities/utilities");

const User = require("../models/user");
const { sendMailSchema } = require('../utilities/validationSchemas');

const authMiddleware = require('../middlewares/auth');
const isAdminMiddleware = require("../middlewares/isAdmin");

router.post('/', [authMiddleware, isAdminMiddleware], async (req, res) => {
  try {
    const reqBody = { ...req.body };

    const result = sendMailSchema.validate({ ...reqBody }, { abortEarly: false });

    if (result.error) {
      let message = [];
      result.error.details.map(detail => {
        message.push(detail.message);
      });
      return res.status(400).send({
        message: message.join(", ")
      });
    }

    let templateDir = path.join(__dirname, '../', 'templates', 'adminMail');

    const adminMailTemplate = new EmailTemplate(templateDir);

    adminMailTemplate.render({
      content: reqBody.emailContent,
    }, (err, adminMailHtml) => {
      if (err) {
        console.log('Mail template render error!');
      }

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: reqBody.email,
        subject: "Welcome to Falabella!",
        html: adminMailHtml.html,
        headers: {
          priority: "high",
        }
      };

      transporter.sendMail({ ...mailOptions })
        .then(() => console.log('Mail send successfully!'))
        .catch(err => console.log(err));

      return res.status(200).send({ message: 'Mail send successfully!' });
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;