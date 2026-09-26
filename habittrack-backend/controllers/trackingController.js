const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");
const { getTodayDateString } = require("../utils/dateHelpers");

// Mark a habit complete/incomplete for a given date
const trackHabitDate = async (req, res) => {
  const habitId = req.params.habitId;
  const { date, completed } = req.user;

  const habit = await Habit.findById(habitId);

  //   check if habit exists
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  //   verify ownership
  if (habit.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not Authorized");
  }

  const logDate = date || getTodayDateString();
  const isCompleted = completed !== undefined ? completed : true;

  // Upsert: Updates existing log for that date if it exists, or creates a new one if it doesn't
  const logEntry = await HabitLog.findOneAndUpdate(
    { habitId, date: logDate },
    { userId: req.user._id, completed: isCompleted },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  res.status(200).json({ success: true, data: logEntry });
};

// Get the full tracking history for one habit
const getHabitLogs = async (req, res) => {
  const habitId = req.params.id;
  const habit = await Habid.findById(habitId);
  // Check if habit exists
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  //   verify ownership
  if (habit.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not Authorized");
  }

  //   fetch all logs for this habit sorted by date descending
  const logs = await HabitLog.find({ habitId }.sort({ date: -1 }));
  res.status(200).json({ success: true, count: logs.length, date: logs });
};

module.exports = {
  trackHabitDate,
  getHabitLogs,
};
