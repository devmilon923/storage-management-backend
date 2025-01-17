const hash = require("../services/hashPassword");

const createUser = async (req, res) => {
  const password = await hash(req.body.password);
  res.send(password);
};

module.exports = {
  createUser,
};
