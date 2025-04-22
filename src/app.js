const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/hello", (req, res) => {
  res.send("Running");
});
// routes import
const { authRouter } = require("./routes/authRoutes");
const { requestRouter } = require("./routes/requestRoutes");
const { profileRouter } = require("./routes/profileRoutes");
const { userRouter } = require("./routes/userRoutes");

// routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected ", err);
  });
