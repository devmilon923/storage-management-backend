const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exites"],
    },
    password: {
      type: String,
      required: true,
    },
    storage: {
      type: Number,
      required: true,
      default: 15,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpType: {
      type: String,
      default: "verify_email",
      enum: ["verify_email", "reset_password"],
    },
    expireIn: {
      type: Date,
      default: null,
    },
    isVerifyed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("users", usersSchema);
module.exports = User;
