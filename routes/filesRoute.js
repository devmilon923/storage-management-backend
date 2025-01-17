const express = require("express");
const {
  addFiles,
  viewFiles,
  createFolder,
  getFolderContent,
} = require("../controllers/filesControlers");

const upload = require("../middlewares/uploadFiles");
const verifyUser = require("../middlewares/verifyUser");
const route = express.Router();
route.post("/upload", verifyUser, upload.array("files", 5), addFiles);
route.get("/view/:id", verifyUser, viewFiles);
route.get("/folder/create/:name", verifyUser, createFolder);
route.get("/folder/view/:name", verifyUser, getFolderContent);

module.exports = route;
