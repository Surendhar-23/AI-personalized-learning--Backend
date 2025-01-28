const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const URL = process.env.MONGOURL;

const connectdb = async function () {
  mongoose
    .connect(URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

const disconnectdb = async function () {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("MongoDB disconnection error:", err);
  }
};

module.exports = { connectdb, disconnectdb };
