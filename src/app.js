const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", async (req, res) => {
  try {
    // console.log(req.body)

    // creating a new instance of a the user model and saving it to the database
    const user = await new User(req.body);
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

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    return res.status(200).json({
      success: true,
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
