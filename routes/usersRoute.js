const express = require("express");
const {
  createUser,
  loginUser,
  dashboard,
  sendResetVerifyOtp,
  handleEmailVerifyOtp,
  handleResetPasswordVerifyOtp,
} = require("../controllers/usersControllers");
const verifyUser = require("../middlewares/verifyUser");

const route = express.Router();
route.post("/create", createUser);
route.post("/login", loginUser);
route.get("/send-email-verification-otp", verifyUser, handleEmailVerifyOtp);
route.post("/send-reset-otp", sendResetVerifyOtp);
route.post("/verify-email-otp", verifyUser, handleEmailVerifyOtp);
route.post("/verify-reset-password-otp", handleResetPasswordVerifyOtp);
// route.post("/send-password-reset-otp", sendPasswordResetOtp);
route.get("/dashboard", verifyUser, dashboard);

module.exports = route;
