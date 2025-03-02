require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const usersRoute = require("./routes/usersRoute");
const filesRoute = require("./routes/filesRoute");
const errorHandler = require("./middlewares/defaultError");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// MongoDB connection:
mongoose
  .connect(process.env.mongodbURL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err.message));

// Routes:
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use("/users", usersRoute);
app.use("/file", filesRoute);

// Default ErrorHanlder:
app.use(errorHandler);

// Server running on:
app.listen(process.env.PORT || 4000, () =>
  console.log(`Server running on port ${process.env.PORT || 4000}`)
);
