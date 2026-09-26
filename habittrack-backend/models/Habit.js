// import mongoose library to define database models and schemas
const mongoose = require("mongoose");

// define structure (schema) for a habit document in mongodb
const habitSchema = new mongoose.Schema(
  {
    // links the habit to a specific user who created it
    user: {
      type: mongoose.Schema.Types.ObjectId, // stores a unique mongoDB ID
      required: true,
      ref: "User", // points to the "User" collection in db
    },
    // name or description of the habit
    title: {
      type: String,
      required: [true, "Please add a habit title"],
      trim: true,
    },
    // how often the habit should be performed
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    // optional target or note for the habit eg: "Read 10 pages"
    goal: {
      type: String,
      default: "",
    },
    // tracks if the habit has been completed for the current day
    completedToday: {
      type: Boolean,
      default: false,
    },
    // tracks the current active streak count
    streak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// export the Habit model so it can be used in controllers to interact with the DB
module.exports = mongoose.model("Habit", habitSchema);