const express = require("express");

const app = express();

// defining a middleware
app.use("/admin", (req, res, next) => {
  const token = "xyzp";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized user");
  } else {
    next();
  }
});

app.get("/admin/dashboard", (req, res) => {
  res.send("This is a dashboard only for admins");
});

// app.get("/user", (req, res) => {
//   res.send({
//     name: "Lucky singh",
//     place: "Kashmir",
//   });
// });

// app.post("/user", (req, res) => {
//   console.log("check request", req.data);
//   res.send("Your data added successfully");
// });

// app.use("/check-json", (req, res) => {
//   res.json({
//     name: "Biplab Paul",
//     place: "Dhanbad",
//     mobile: "+91 7004466712",
//   });
// });

// app.use("/dashboard", (req, res) => {
//   res.send(" Hi this is Dashboard");
// });

app.listen(3001, () => {
  console.log("Yeah, the server is running!");
});
