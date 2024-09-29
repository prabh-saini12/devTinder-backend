const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

const SignUp = async (req, res) => {
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
};

const Login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // create a JWT Token

      const token = await user.getJWT();

      // add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        // secure: true,
        expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      });
      res.send("Login successful");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    console.log("ERROR " + error.message);
  }
};

const LogOut = async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("Logout successful");
  } catch (error) {
    console.log("ERROR " + error.message);
  }
};

module.exports = { SignUp, Login, LogOut };
