const addFiles = (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }
    res.status(200).send({
      message: "Files uploaded successfully",
      files: files,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addFiles,
};
