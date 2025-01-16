const mongoose = require("mongoose");

const folderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Folder name already has"],
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
