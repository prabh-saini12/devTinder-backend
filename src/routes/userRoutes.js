const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { Requests, Connections,Feed } = require("../controllers/userController");

const userRouter = express.Router();

// Get all the pending requests for the logged in user
userRouter.get("/user/requests/recieved", userAuth, Requests);
userRouter.get("/user/connections", userAuth, Connections);
userRouter.get("/feed", userAuth, Feed);

module.exports = { userRouter };
