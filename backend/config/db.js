const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB successfully connected");
  } catch (err) {
    console.log("DB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
