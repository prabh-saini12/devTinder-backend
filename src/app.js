const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/user");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", async (req, res) => {
  try {
    // creating a new instance of a the user model and saving it to the database
    const user = await new User({
      firstName: "john",
      lastName: "deo",
      emailId: "john@gmail.com",
      password: "12345",
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
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
