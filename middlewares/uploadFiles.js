const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
   
    const extension = path.extname(file.originalname);
    const fileName = `${
      file.originalname.split(".")[0]
    }.${Date.now()}${extension}`;
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
      file.mimetype === "video/mp4" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file"));
    }
  },
});
module.exports = upload;
