const mongoose = require("mongoose");

const folderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "files",
      },
    ],
  },
  { timestamps: true }
);
const Folders = mongoose.model("folders", folderSchema);
module.exports = Folders;
