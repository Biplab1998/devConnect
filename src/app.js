const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const fetchedUser = await User.findOne({ emailId });
    console.log("chec bip pass", fetchedUser);
    if (!fetchedUser) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      fetchedUser?.password
    );

    if (isPasswordValid) {
      const token = jwt.sign({ _id: fetchedUser?._id }, "DEV@Connect1998");

      res.cookie("token", token);
      res.send("User login successful!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const userFirstName = req?.user?.firstName;
  res.send(userFirstName + " Send a connection request!");
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log(req.body);

  try {
    const fetchedUser = await User.find({ emailId: userEmail });
    fetchedUser.length <= 0
      ? res.status(404).send("User does not exists")
      : res.send(fetchedUser);
    console.log(fetchedUser);
  } catch (err) {
    res.status(400).send("User not found: something when wrong");
  }
});

app.get("/feed", async (req, res) => {
  console.log(req.body);

  try {
    const fetchedUser = await User.find({});
    fetchedUser.length <= 0
      ? res.status(404).send("User does not exists")
      : res.send(fetchedUser);
    console.log(fetchedUser);
  } catch (err) {
    res.status(400).send("User not found: something when wrong");
  }
});

// Update user
app.delete("/user", async (req, res) => {
  const userID = req.body.userId;
  console.log(req.body);

  try {
    const updateUser = await User.findByIdAndDelete(userID);

    res.send(updateUser);
  } catch (err) {
    res.status(400).send("User not found: something when wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  console.log("body", req.body);
  console.log("params", userId);

  try {
    const allowedUpdates = ["gender", "age", "photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (req.body?.skills?.length > 5) {
      throw new Error("Skills can be 5 maximum");
    }

    const updateUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log(updateUser);

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("User not found: " + err.message);
  }
});

// Check Database connection
connectDB()
  .then(() => {
    console.log("Database connected ✅", connectDB);
    app.listen(3001, () => {
      console.log("Yeah, the server is running!");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected ❌");
  });
