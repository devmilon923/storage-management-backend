const User = require("../models/users");
const createJWT = require("../services/createJWT");
const { hash, verifyHash } = require("../services/hashPassword");

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

const loginUser = async (req, res) => {
  try {
    // const hashPassword = await hash(req.body.password);
    const user = await User.findOne({ email: req.body.email });
    const dbPassword = user.password;
    const isValidPassword = await verifyHash(req.body.password, dbPassword);
    if (!isValidPassword)
      return res.status(400).send({
        status: false,
        message: "Invalid credentials",
      });

    const token = createJWT({ _id: user._id });
    res.status(200).send({
      status: true,
      token,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
const dashboard = async (req, res) => {
  res.status(200).send({
    status: true,
    message: req.userInfo,
  });
};
module.exports = {
  createUser,
  loginUser,
  dashboard,
};
