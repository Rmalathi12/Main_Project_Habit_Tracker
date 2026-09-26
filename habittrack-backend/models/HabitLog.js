// import mongoose
const mongoose = require("mongoose");

// define the structure(schema) for daily habit tracking records
const habitLogSchema = new mongoose.Schema(
  {
    // links the log entry to a specific habit
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Habit",
    },
    //   links the log entry to the user who owns it(for fast queries)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    //   the date of the tracking log in "YYYY-MM-DD" format
    date: {
      type: String,
      required: true,
    },

    //   whether the habit completed on this date(true/false)
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// compound index:ensures a user can only have One log entry per Habit per Date(prevents duplicates)
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

// export the habitlog model
module.exports = mongoose.model("HabitLog", habitLogSchema);
