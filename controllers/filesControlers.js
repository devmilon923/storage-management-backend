const mongoose = require("mongoose");
const Files = require("../models/filesSchema");
const Folders = require("../models/folderSchema");
const PrivateSpace = require("../models/privateSpaceSchema");
const User = require("../models/users");
const path = require("path");
const addFiles = async (req, res) => {
  //Post request:
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
const shareFile = async (req, res) => {
  //Get request:
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
const viewFile = async (req, res) => {
  //Get request:
  try {
    const file = await Files.findById(req.params.id);
    if (file?.user.toString() !== req.userInfo._id)
      return res.status(404).send("Access denie");
    if (!file) {
      return res
        .status(404)
        .send({ message: "File not found in the database." });
    }
    const getFile = path.join(__dirname, "../", file.path);
    res.status(200).sendFile(getFile);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const createFolder = async (req, res) => {
  //Get request:
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
const createSpace = async (req, res) => {
  //Post request

  try {
    const space = await PrivateSpace.findOne({
      user: req.userInfo._id,
    });
    if (space) {
      return res.status(404).send("This already have one Private Space");
    }
    await PrivateSpace.create({
      pin: req.body.pin,
      user: req.userInfo._id,
    });

    res.status(200).send("Private Space Created Succesdfully");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const loginSpace = async (req, res) => {
  //Post request

  try {
    const space = await PrivateSpace.findOne({
      user: req.userInfo._id,
    }).populate("files");
    if (!space) {
      return res.status(404).send("No private space found");
    }
    if (space.pin !== parseInt(req.body.pin)) {
      return res.status(404).send("Invalid credentials");
    }

    res.status(200).send(space.files || []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const getFolderContent = async (req, res) => {
  //Get request:
  try {
    const folder = await Folders.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userInfo._id),
          name: req.params.name,
        },
      },
      {
        $unwind: "$files",
      },
      {
        $lookup: {
          from: "files",
          localField: "files",
          foreignField: "_id",
          as: "files",
        },
      },
      {
        $unwind: "$files",
      },
      {
        $match: {
          "files.status": "public",
        },
      },
      {
        $project: {
          _id: 0,
          files: 1,
        },
      },
    ]);

    res.status(200).send(folder);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const addFilesInSpace = async (req, res) => {
  //Post request:
  try {
    await Files.updateMany(
      {
        _id: { $in: req.body },
        status: "public",
      },
      {
        $set: {
          status: "private",
        },
      }
    );
    const addData = await PrivateSpace.updateMany(
      { user: req.userInfo._id },

      {
        $addToSet: { files: { $each: req.body } }, // $addToSet ensures uniqueness
      }
    );
    res.status(200).send(addData || []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const removeFilesFromSpace = async (req, res) => {
  //Post request:
  try {
    await Files.updateMany(
      {
        _id: { $in: req.body },
        status: "private",
      },
      {
        $set: {
          status: "public",
        },
      }
    );
    const addData = await PrivateSpace.updateMany(
      { user: req.userInfo._id },

      {
        $pull: { files: { $in: req.body } }, // $addToSet ensures uniqueness
      }
    );
    res.status(200).send(addData || []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const addFilesInFolder = async (req, res) => {
  //Post request:
  try {
    const addData = await Folders.updateMany(
      { user: req.userInfo._id, name: req.body.folderName },
      {
        $addToSet: { files: { $each: req.body.ids } },
      }
    );
    res.status(200).send(addData || []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const removeFiles = async (req, res) => {
  //Post request:
  try {
    const addData = await Folders.updateMany(
      { user: req.userInfo._id },
      {
        $pull: { files: { $in: req.body } },
      }
    );
    await Files.deleteMany({
      _id: {
        $in: req.body,
      },
    });
    res.status(200).send(addData || []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const viewFiles = async (req, res) => {
  //Get request:
  try {
    const allFiles = await Files.find({
      user: req.userInfo._id,
      status: "public",
    })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).send(allFiles || []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const renameFile = async (req, res) => {
  //Post request:
  try {
    const update = await Files.findByIdAndUpdate(req.params.id, {
      originalname: req.body.name,
    });

    res.status(200).send(update || []);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const duplicateFile = async (req, res) => {
  //Get request:
  try {
    const getFile = await Files.findById(req.params.id);
    if (!getFile) return res.status(404).send("Missing file");
    const modify = getFile.originalname.split(".");
    const newName = modify[0] + "Copy." + modify[1];
    const { _id, __v, createdAt, updatedAt, ...newFile } = getFile.toObject();
    const respo = await Files.create({ ...newFile, originalname: newName });
    res.status(200).send(respo || {});
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const allFileInfo = async (req, res) => {
  //Get request:
  try {
    const info = await Files.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userInfo._id),
        },
      },
      {
        $group: {
          _id: "$type", // Group by file type
          files: { $push: "$$ROOT" }, // Push all files of the same type
          totalSize: { $sum: "$size" }, // Calculate total size for each type
        },
      },
      {
        $group: {
          _id: null, // Combine all groups for calculating finalSize
          fileTypes: {
            $push: {
              type: "$_id",
              files: "$files",
              totalSize: "$totalSize",
            },
          },
          finalSize: { $sum: "$totalSize" }, // Total size of all files
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id
          fileTypes: 1, // Include the grouped file types
          finalSize: 1, // Include the total size of all files
        },
      },
    ]);
    // res.status(200).send(info || []);
    res.status(200).send(info[0] || { fileTypes: [], finalSize: 0 });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const getAllFolderContent = async (req, res) => {
  //Get request:
  try {
    const info = await Folders.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userInfo._id),
        },
      },
      {
        $unwind: {
          path: "$files",
          preserveNullAndEmptyArrays: true, // Ensure folders with no files are still included
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "files",
          foreignField: "_id",
          as: "fileDetails",
        },
      },
      {
        $unwind: {
          path: "$fileDetails",
          preserveNullAndEmptyArrays: true, // Preserve folders with no file matches
        },
      },
      {
        $group: {
          _id: "$name", // Group by folder name
          files: { $push: "$fileDetails" }, // Gather all file details in an array
          totalSize: { $sum: { $ifNull: ["$fileDetails.size", 0] } }, // Sum file sizes; handle nulls
        },
      },
    ]);

    res.status(200).send(info || { fileTypes: [], finalSize: 0 });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addFiles,
  shareFile,
  createFolder,
  getFolderContent,
  viewFile,
  addFilesInSpace,
  createSpace,
  loginSpace,
  removeFilesFromSpace,
  addFilesInFolder,
  removeFiles,
  viewFiles,
  renameFile,
  duplicateFile,
  getAllFolderContent,
  allFileInfo,
};
