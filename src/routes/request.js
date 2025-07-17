const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/sendConnectionRequest/:status/:toUserId",
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

      const connectionRequestDetails = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await connectionRequestDetails.save();

      res.json({
        message: "Connected request send successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err);
    }
  }
);

module.exports = requestRouter;
