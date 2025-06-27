const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  try {
    user.save();
    res.send("User added successfully");
  } catch (err) {
    res.send(400, "User not added: something when wrong");
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
    res.send(400, "User not found: something when wrong");
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
    res.send(400, "User not found: something when wrong");
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
app.patch("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log(req.body);

  try {
    const updateUser = await User.findOneAndUpdate(
      { emailId: userEmail },
      req.body,
      {
        returnDocument: "before",
      }
    );

    res.send(updateUser);
  } catch (err) {
    res.status(400).send("User not found: something when wrong");
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
