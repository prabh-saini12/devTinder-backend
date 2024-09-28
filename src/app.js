const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", async (req, res) => {
  try {
    // console.log(req.body)
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance of a the user model and saving it to the database
    const user = await new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      // user,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong ");
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

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    //const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});
// Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.key(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error(" updates not allowed");
    }
    if (data?.skills.length > 20) {
      throw new Error("skills length should be less than 20");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE failed : " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;
    // console.log(cookie);
    const { token } = cookie;
    // console.log(token);
    if (!token) {
      throw new Error("Invalid token");
    }
    // validate my token
    const isTokenValid = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(isTokenValid);

    const { _id } = isTokenValid;
    console.log(_id);

    const user = await User.findById(_id).select("-password");

    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a JWT Token
      const token = await jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      console.log(token);

      // add the token to cookie and send the response back to the user
      res.cookie("token", token, {});
      res.send("Login successful");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    console.log("ERROR " + error.message);
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
