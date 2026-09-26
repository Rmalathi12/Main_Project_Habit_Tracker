// import mongoose library
const mongoose = require("mongoose");

// function to connect mongoDB database
const connectDB = async () => {
  try {
    // Attempt connection using MONGODB_URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (error) {
    // if connection fails, log error and shut down server
    console.log(`Error Connecting to MongoDB:${error.message}`);
    process.exit(1); //exit process with failure
  }
};

module.exports = connectDB;
