const bcrypt = require("bcrypt");

const hash = async (password) => {
  console.log(password);
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.error("Error hashing password:", error);
    return null;
  }
};
const verifyHash = async (password, hashPassword) => {
  try {
    const passwordHash = await bcrypt.compare(password, hashPassword);
    console.log(passwordHash);
    return passwordHash;
  } catch (error) {
    console.error("Error hashing password:", error);
    return false;
  }
};

module.exports = { hash, verifyHash };
