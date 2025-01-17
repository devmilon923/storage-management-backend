const express = require("express");
const { createUser } = require("../controllers/usersControllers");

const route = express.Router();

route.post("/create", createUser);

module.exports = route;
