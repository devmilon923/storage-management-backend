const express = require("express");
const { addFiles } = require("../controllers/filesControlers");
const upload = require("../middlewares/uploadFiles");
const verifyUser = require("../middlewares/verifyUser");
const route = express.Router();
route.post("/upload", verifyUser, upload.array("files", 5), addFiles);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzhhMTVkODliOWE1ZTAwYjdiMmVjMGQiLCJpYXQiOjE3MzcxMjI5MDMsImV4cCI6MTczNzEyNjUwM30.bN8NEln9nbNvuCiOMUVtdvfw0Wf8jKwFZ-xyeVCDg6Q
module.exports = route;
