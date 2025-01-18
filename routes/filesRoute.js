const express = require("express");
const {
  addFiles,
  shareFile,
  createFolder,
  getFolderContent,
  viewFile,
  createSpace,
  loginSpace,
  addFilesInSpace,
  removeFilesFromSpace,
  addFilesInFolder,
  removeFiles,
  viewFiles,
  renameFile,
  duplicateFile,
} = require("../controllers/filesControlers");

const upload = require("../middlewares/uploadFiles");
const verifyUser = require("../middlewares/verifyUser");
const checkFile = require("../middlewares/checkUserStatus");
const checkUserStatus = require("../middlewares/checkUserStatus");
const route = express.Router();

// Note: Main root route is : '/file'
route.post(
  "/upload",
  verifyUser,
  checkUserStatus,
  upload.array("files", 5),
  addFiles
); // add files
route.get("/share/:id", verifyUser, shareFile); //share file
route.get("/folder/create/:name", verifyUser, checkUserStatus, createFolder); // create folder by :folderName
route.get("/folder/view/:name", verifyUser, getFolderContent); // view folder by :folderName
route.post("/rename/:id", verifyUser, renameFile); // view folder by request body:{name:'name2'} and params :fileID
route.get("/duplicate/:id", verifyUser, duplicateFile); // duplicate File
route.get("/view/:id", verifyUser, viewFile); // view file by :fileId
route.get("/view-all", verifyUser, viewFiles); // view all files
route.post("/private/space/create", verifyUser, checkUserStatus, createSpace); // create private space using request header Bearer with body:{pin: type_number}
route.post("/private/space/login", verifyUser, loginSpace); // login private space using request header Bearer with body:{pin: type_number}

route.post("/private/space/add-files", verifyUser, addFilesInSpace); // add-files in private space using request header Bearer with body: ['files_id']

route.post("/private/space/remove-files", verifyUser, removeFilesFromSpace); // remove files from private space using request header Bearer with body: ['files_id']

route.post("/folder/add-files", verifyUser, addFilesInFolder); // add-files in folder using request header Bearer with body:
// {
//   "folderName": "Milon",
//   "ids":["678a795ebb974c8a06dc111c","678a795ebb974c8a06dc111e"]
// }

route.post("/remove", verifyUser, removeFiles); // delete files using request header Bearer with body: ['files_id']

module.exports = route;
