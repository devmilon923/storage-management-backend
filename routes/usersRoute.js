const express = require("express");
const {
  createUser,
  loginUser,
  dashboard,
  sendResetVerifyOtp,
  handleEmailVerifyOtp,
  handleResetPasswordVerifyOtp,
  sendEmailVerifyOtp,
  changePassword,
  deleteAccount,
} = require("../controllers/usersControllers");
const verifyUser = require("../middlewares/verifyUser");
const { myProfile } = require("../controllers/filesControlers");

const route = express.Router();
// Note: Main root route is : '/users'
route.post("/create", createUser);
route.post("/login", loginUser);

route.get("/send-email-verification-otp", verifyUser, sendEmailVerifyOtp); // send email verification otp by using request header Bearer and request body not required.

route.post("/send-reset-otp", sendResetVerifyOtp); // send Reset password Verify Otp by using request body and required field is : email: #user_email}

route.post("/verify-email-otp", verifyUser, handleEmailVerifyOtp); // verify-reset-password-otp by using request header Bearer and request body required field is : {action: #action_must_be:enum: ["verify_email", "reset_password"], otp: #otp_get_from_email}

route.post("/verify-reset-password-otp", handleResetPasswordVerifyOtp); // verify-reset-password-otp by using request body and required field is : {action: #action_must_be:enum: ["verify_email", "reset_password"], email: #user_email, otp: #otp_get_from_email}

route.post("/change-password", verifyUser, changePassword);
route.get("/delete-account", verifyUser, deleteAccount);

module.exports = route;
