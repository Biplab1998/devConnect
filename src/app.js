const express = require("express");

const app = express();

app.use("/dashboard", (req, res) => {
  res.send(" Hi this is Dashboard");
});

app.use("/check-json", (req, res) => {
  res.json({
    name: "Biplab Paul",
    place: "Dhanbad",
    mobile: "+91 7004466712",
  });
});

app.listen(3001, () => {
  console.log("Yeah, the server is running!");
});
