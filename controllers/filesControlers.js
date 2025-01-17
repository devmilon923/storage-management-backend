const Files = require("../models/filesSchema");
const Folders = require("../models/folderSchema");
const User = require("../models/users");
const mongoose = require("mongoose");
const addFiles = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const data = files.map(({ encoding, ...rest }) => {
      const format = {
        ...rest,
        user: req.userInfo._id,
        type: rest.mimetype.split("/")[1],
      };
      const { mimetype, ...finalData } = format;
      return finalData;
    });
    await Files.insertMany(data);
    res.status(200).send({
      message: "Files uploaded successfully",
      files: data,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const viewFiles = async (req, res) => {
  try {
    const file = await Files.findById(req.params.id);

    if (file?.user.toString() !== req.userInfo._id)
      return res.status(404).send("Access denie");
    if (!file) {
      return res
        .status(404)
        .send({ message: "File not found in the database." });
    }

    res.status(200).send(`${process.env.appURL}/${file.path}`);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createFolder = async (req, res) => {
  try {
    const folder = await Folders.findOne({
      name: req.params.name,
      user: req.userInfo._id,
    });
    if (folder) {
      return res.status(404).send("Already has this folder name");
    }
    const folderCreate = await Folders.create({
      name: req.params.name,
      user: req.userInfo._id,
    });

    res.status(200).send(folderCreate);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getFolderContent = async (req, res) => {
  try {
    const folder = await Folders.find({
      name: req.params.name,
      user: req.userInfo._id,
    }).populate("files");

    res.status(200).send(folder.files || []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
module.exports = {
  addFiles,
  viewFiles,
  createFolder,
  getFolderContent,
};
