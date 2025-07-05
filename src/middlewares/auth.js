const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token!");
    }
    const validToken = await jwt.verify(token, "DEV@Connect1998");

    const { _id } = validToken;

    const authenticatedUser = await User.findById(_id);

    if (!authenticatedUser) {
      throw new Error("User not found");
    }

    req.user = authenticatedUser;

    next();
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
};

module.exports = {
  userAuth,
};
