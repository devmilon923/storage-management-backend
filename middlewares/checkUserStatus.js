const User = require("../models/users");

const checkUserStatus = async (req, res, next) => {
  const user = await User.findById(req.userInfo._id);
  if (!user)
    return res.status(400).send({
      status: false,
      message: "Invalid user",
    });
  if (!user.isVerifyed)
    return res.status(400).send({
      status: false,
      message: "User not verifyed! please verify your email",
    });

  next();
};
module.exports = checkUserStatus;
