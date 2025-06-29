const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("User not added:" + err.message);
  }
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
  console.log(req.body);
  console.log(req.params);

  try {
    const allowedUpdates = [
      "gender",
      "age",
      "password",
      "photoUrl",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (req.body?.skills.length > 5) {
      throw new Error("Skills can be 5 maximum");
    }

    const updateUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
      returnDocument: "before",
      runValidators: true,
    });

    res.send(updateUser);
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
