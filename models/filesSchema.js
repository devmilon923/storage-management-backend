const mongoose = require("mongoose");

const filesSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["jpeg", "png", "pdf", "mp4", "jpg"],
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["private", "public"],
      default: "public",
    },
  },
  { timestamps: true }
);
const Files = mongoose.model("files", filesSchema);
module.exports = Files;
