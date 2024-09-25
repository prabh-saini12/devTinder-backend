const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected ", err);
  });
