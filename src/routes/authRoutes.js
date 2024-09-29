const express = require("express");
const authRouter = express.Router();
const { SignUp ,Login,LogOut} = require("../controllers/authController");

authRouter.post("/signup", SignUp);

authRouter.post("/login", Login);

authRouter.post("/logout",LogOut);

module.exports = { authRouter };
