const { ConnectionRequest } = require("../models/connectionRequest");
const User = require("../models/user");

const sendConnectionRequest = async (req, res) => {
  try {
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type" });
    }

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // if there is an  existing connection request

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const connectionRequest = await new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();

    const statusMessage =
      status === "interested"
        ? `${req.user.firstName} is interested in ${toUser.firstName}`
        : `${req.user.firstName} has ignored ${toUser.firstName}`;

    res.status(200).json({
      message: statusMessage,
      data,
    });
  } catch (error) {
    res.status(404).send("ERROR " + error.message);
  }
};

const reviewConnectionRequest = async (req, res) => {
  // krish => gayle => accepted
  // toUserId is the reciever of the request and he is the one to review the request
  // toUser should be logged in user
  // status = intrerested
  // requestId should be valid (present in the database)
  try {
    const loggedInUser = req.user;

    // validate the status
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      fromUserId: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "connection Request not found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.status(200).json({ message: "Connection request " + status, data });
  } catch (error) {
    res.status(404).send("ERROR " + error.message);
  }
};

module.exports = { sendConnectionRequest, reviewConnectionRequest };
