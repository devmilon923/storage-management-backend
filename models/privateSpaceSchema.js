const mongoose = require("mongoose");

const privateSpaceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: [true, "One Private Space for one user"],
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "files",
      },
    ],
    pin: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const PrivateSpace = mongoose.model("privateSpace", privateSpaceSchema);
