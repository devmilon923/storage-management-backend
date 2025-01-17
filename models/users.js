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
      required: true,
      default: null,
    },
    otpType: {
      type: String,
      required: true,
      default: "verify_email",
      enum: ["verify_email", "reset_password"],
    },
    expireIn: {
      type: Number,
      required: true,
      default: null,
    },
    isVerifyed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("users", usersSchema);
