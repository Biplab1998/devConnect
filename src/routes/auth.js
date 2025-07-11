const express = require("express");

const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    console.log(passwordHash);

    const userData = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    };

    const user = new User(userData);

    await user.save();

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("User not added:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const fetchedUser = await User.findOne({ emailId });
    console.log("chec bip pass", fetchedUser);
    if (!fetchedUser) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await fetchedUser.validatePassword(password);

    if (isPasswordValid) {
      const token = await fetchedUser.getJWT();

      res.cookie("token", token);
      res.send("User login successful!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
});

authRouter.post("/logout", (req, res) => {
  req.cookies("token", null, { expires: new Date(Date.now()) });

  res.send("Logout successful");
});

module.exports = authRouter;
