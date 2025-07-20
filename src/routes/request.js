const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequestDetails = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await connectionRequestDetails.save();

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: req?.user?._id,
        status: "interested",
      });

      if (!connectRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectRequest.status = status;

      // res.send(connectRequest);

      const updateResponse = await connectRequest.save();

      res.json({
        message: "Connection request " + status,
        updateResponse,
      });
    } catch (err) {
      res.status(400).send("Error: " + err);
    }
  }
);

module.exports = requestRouter;
