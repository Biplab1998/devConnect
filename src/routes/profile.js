const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateSignUpData,
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const userEditData = req.body;

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (key) => (loggedInUser[key] = userEditData[key])
    );

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    console.log("check req1", req.body);
    const existingPassword = req.body.existingPassword;
    const newPassword = req.body.newPassword;
    const loggedInUser = req.user;
    console.log("check login user", loggedInUser);

    const checkExistingPassword = await loggedInUser.validatePassword(
      existingPassword
    );
    if (checkExistingPassword) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      Object.keys(req.body).forEach(
        (key) => (loggedInUser["password"] = hashedNewPassword)
      );

      await loggedInUser.save();
      res.send("Password updated successfully");
    } else {
      throw new Error("Please enter correct old password");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
