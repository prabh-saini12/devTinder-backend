const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { GetProfile, EditProfile } = require("../controllers/profileController");

profileRouter.get("/profile/view", userAuth, GetProfile);

profileRouter.patch("/profile/edit", userAuth, EditProfile);

module.exports = { profileRouter };
