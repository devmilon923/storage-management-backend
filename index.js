require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName = `${
      file.originalname.split(".")[0]
    }.${Date.now()}-${extension}`;
    cb(null, fileName);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/mp4" ||
      file.mimetype === "image/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file"));
    }
  },
});
app.get("/", (req, res) => {
  res.send("Server in live");
});
app.post("/upload-file", upload.array("file", 5), (req, res) => {
  console.log(req.files);
  res.send("Server in live");
});
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("success");
  }
});
app.listen(process.env.PORT || 4000, () =>
  console.log(`Server running on port ${process.env.PORT || 4000}`)
);
