const User = require("../models/users");
const hash = require("../services/hashPassword");

const createUser = async (req, res) => {
  try {
    const hashPassword = await hash(req.body.password);
    const user = await User.create({ ...req.body, password: hashPassword });
    const { password, ...userWithoutPassword } = req.body;
    res.status(200).send({
      status: true,
      user: { ...userWithoutPassword, _id: user._id },
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
};
