const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

// routes import
const { authRouter } = require("./routes/authRoutes");
const { requestRouter } = require("./routes/requestRouter");
const { profileRouter } = require("./routes/profileRoutes");

// routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
