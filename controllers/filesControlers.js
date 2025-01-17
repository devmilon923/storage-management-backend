const Files = require("../models/filesSchema");
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
module.exports = {
  addFiles,
  viewFiles,
};
