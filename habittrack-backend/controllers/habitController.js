const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");

// Create a new habit
const createHabit = async (req, res) => {
  const { title, frequency, goal } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Please add a habit title");
  }

  const habit = await Habit.create({
    user: req.user._id,
    title,
    frequency: frequency || "daily",
    goal: goal || "",
  });
  res.status(201).json({ success: true, data: habit });
};

// Get all habits belonging to the logged-in user
const getHabits = async (req, res) => {
  const habits = await Habit.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, count: habits.length, data: habits });
};

// Get a single habit's details by ID
const getHabitById = async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }
  if (habit.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this habit");
  }
  res.status(200).json({ success: true, data: habit });
};

// Update habit's title, frequency, or goal
const updateHabit = async (req, res) => {
  let habit = await Habit.findById(req.params.id);
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  if (habit.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this habit");
  }

  habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: habit });
};

// Toggle habit completion status for today & sync HabitLog in Atlas
const toggleHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res
        .status(404)
        .json({ success: false, message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Flip the status
    habit.completedToday = !habit.completedToday;

    if (habit.completedToday) {
      habit.streak = (habit.streak || 0) + 1;
    } else {
      habit.streak = Math.max(0, (habit.streak || 1) - 1);
    }

    await habit.save();

    // Normalize today's date to remove time stamps for precise daily logging
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create a HabitLog entry for today so it persists in MongoDB Atlas
    let habitLog = await HabitLog.findOne({
      habitId: habit._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (habit.completedToday) {
      if (!habitLog) {
        await HabitLog.create({
          userId: req.user._id, // <-- FIXED: Changed from 'user' to 'userId'
          habitId: habit._id,
          date: new Date(),
          completed: true,
        });
      } else {
        habitLog.completed = true;
        await habitLog.save();
      }
    } else {
      if (habitLog) {
        // Remove or mark uncompleted if toggled off
        await habitLog.deleteOne();
      }
    }

    res.status(200).json({ success: true, data: habit });
  } catch (error) {
    console.error("TOGGLE HABIT ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a habit and all its associated tracking logs
const deleteHabit = async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  if (habit.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not Authorized to delete this Habit");
  }

  await HabitLog.deleteMany({ habitId: habit._id });
  await habit.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Habit and related logs deleted" });
};

module.exports = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  toggleHabit,
  deleteHabit,
};
