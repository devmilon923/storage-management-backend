const express = require("express");
const { addFiles } = require("../controllers/filesControlers");
const upload = require("../middlewares/uploadFiles");
const route = express.Router();
route.post("/upload", upload.array("files", 5), addFiles);

module.exports = route;
