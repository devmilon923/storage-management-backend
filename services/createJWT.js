const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.privateKey);
    return token;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
module.exports = createJWT;
