const router = require("express").Router();

const User = require("../models/user");
const { setAdminSchema } = require("../utilities/validationSchemas");

router.put("/", async (req, res) => {
  const reqQuery = { ...req.query };

  const result = setAdminSchema.validate({ ...reqQuery }, { abortEarly: false });

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
      _id: reqQuery._id
    },
      {
        $set: { isAdmin: true },
      },
      {
        new: true
      }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'User attached with requested id not found!' });
    }

    return res.status(200).send(updatedUser);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;