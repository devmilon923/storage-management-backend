const express = require("express");
const {
  createUser,
  loginUser,
  dashboard,
} = require("../controllers/usersControllers");
const verifyUser = require("../middlewares/verifyUser");

const route = express.Router();

route.post("/create", createUser);
route.post("/login", loginUser);
route.get("/dashboard", verifyUser, dashboard);

module.exports = route;
