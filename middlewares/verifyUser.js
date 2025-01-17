const jwt = require("jsonwebtoken");
const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.privateKey);
    req.userInfo = payload;
    next();
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Unauthorized",
    });
  }
};

module.exports = verifyUser;
