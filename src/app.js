const express = require("express");

const app = express();

app.use("/user", (req, res) => {
  res.send("Heheheheheeeeeeeeeeeeeeeeeeeeeee");
});

app.get("/user", (req, res) => {
  res.send({
    name: "Lucky singh",
    place: "Kashmir",
  });
});

app.post("/user", (req, res) => {
  console.log("check request", req.data);
  res.send("Your data added successfully");
});

app.use("/check-json", (req, res) => {
  res.json({
    name: "Biplab Paul",
    place: "Dhanbad",
    mobile: "+91 7004466712",
  });
});

app.use("/dashboard", (req, res) => {
  res.send(" Hi this is Dashboard");
});

// app.use("/", (req, res) => {
//   res.send("Main page with / route");
// });

app.listen(3001, () => {
  console.log("Yeah, the server is running!");
});
