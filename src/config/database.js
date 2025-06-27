const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://bittupaul1998:M8azc47F0z2nOdTT@researchwithnode.sp3t7zc.mongodb.net/devConnect"
  );
};

module.exports = connectDB;
