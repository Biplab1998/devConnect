const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
