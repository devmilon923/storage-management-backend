const User = require("../models/users");

const createJWT = require("../services/createJWT");
const { hash, verifyHash } = require("../services/hashPassword");
const sendEmail = require("../services/sendEmail");

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
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send({
        status: false,
        message: "Invalid credentials",
      });

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

const sendEmailVerifyOtp = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo._id);
    if (!user)
      return res.status(404).send({
        status: false,
        message: "Account not found",
      });
    if (user.isVerifyed !== false)
      return res.status(404).send({
        status: false,
        message: "Your account is already verifyed",
      });

    const otp = Math.floor(10000 + Math.random() * 90000);
    user.otp = otp;
    user.otpType = "verify_email";
    user.expireIn = new Date(new Date().getTime() + 60 * 60 * 1000);
    user.isVerifyed = false;
    await sendEmail(user.email, "Verify Your Account", otp);
    await user.save();
    return res.status(200).send({
      status: true,
      message: "Email send successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
const handleEmailVerifyOtp = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo._id);
    if (!user)
      return res.status(404).send({
        status: false,
        message: "Account not found",
      });
    if (user.isVerifyed === false && req.body.action === "reset_password")
      return res.status(404).send({
        status: false,
        message: "Need to verify your account first",
      });
    if (user.otpType !== req.body.action)
      return res.status(404).send({
        status: false,
        message: "Invalid action",
      });
    if (user.expireIn <= new Date())
      return res.status(404).send({
        status: false,
        message: "Otp expire",
      });

    if (user.otp !== parseInt(req.body.otp))
      return res.status(404).send({
        status: false,
        message: "Invalid otp",
      });

    user.otp = null;
    user.otpType = null;
    user.expireIn = null;
    user.isVerifyed = true;
    await user.save();
    return res.status(200).send({
      status: true,
      message: "Verification success",
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
const sendResetVerifyOtp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).send({
        status: false,
        message: "Account not found",
      });
    if (user.isVerifyed !== true)
      return res.status(404).send({
        status: false,
        message: "Your need verify your account first",
      });
    const otp = Math.floor(10000 + Math.random() * 90000);
    user.otp = otp;
    user.otpType = "reset_password";
    user.expireIn = new Date(new Date().getTime() + 60 * 60 * 1000);
    await sendEmail(user.email, "Reset your password", otp);
    await user.save();
    return res.status(200).send({
      status: true,
      message: "Reset password email send successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
const handleResetPasswordVerifyOtp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).send({
        status: false,
        message: "Account not found",
      });

    if (user.otpType !== req.body.action)
      return res.status(404).send({
        status: false,
        message: "Invalid action",
      });
    if (user.expireIn <= new Date())
      return res.status(404).send({
        status: false,
        message: "Otp expire",
      });

    if (user.otp !== parseInt(req.body.otp))
      return res.status(404).send({
        status: false,
        message: "Invalid otp",
      });

    if (user.otpType === "reset_password") {
      try {
        const hashPassword = await hash(req.body.password);
        if (!hashPassword) {
          return res.status(404).send({
            status: false,
            message: "New password is required",
          });
        }
        user.password = hashPassword;
        user.otp = null;
        user.otpType = null;
        user.expireIn = null;
        user.isVerifyed = true;
        await user.save();
        return res.status(200).send({
          status: true,
          message: "Password change success",
        });
      } catch (error) {
        return res.status(404).send({
          status: false,
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).send({
      status: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  // post request:
  try {
    const user = await User.findById(req.userInfo._id);
    if (!user)
      return res.status(404).send({
        status: false,
        message: "Account not found",
      });
    const verifyPassword = await verifyHash(
      req.body.oldPassword,
      user.password
    );
    if (verifyPassword) {
      try {
        const hashPassword = await hash(req.body.newPassword);
        if (!hashPassword) {
          return res.status(404).send({
            status: false,
            message: "New password is required",
          });
        }
        user.password = hashPassword;
        await user.save();
        return res.status(200).send({
          status: true,
          message: "Password change success",
        });
      } catch (error) {
        return res.status(404).send({
          status: false,
          message: error.message,
        });
      }
    } else {
      return res.status(404).send({
        status: false,
        message: "Invalid password",
      });
    }
  } catch (error) {
    return res.status(404).send({
      status: false,
      message: error.message,
    });
  }
};
const deleteAccount = async (req, res) => {
  // get request:
  try {
    const user = await User.deleteOne({ _id: req.userInfo._id });
    if (!user)
      return res.status(404).send({
        status: false,
        message: "Account not found",
      });

    return res.status(200).send({
      status: true,
      message: "Account success to delete",
    });
  } catch (error) {
    return res.status(404).send({
      status: false,
      message: error.message,
    });
  }
};
module.exports = {
  createUser,
  loginUser,

  sendEmailVerifyOtp,
  handleEmailVerifyOtp,
  handleResetPasswordVerifyOtp,
  sendResetVerifyOtp,
  changePassword,
  deleteAccount,
};
