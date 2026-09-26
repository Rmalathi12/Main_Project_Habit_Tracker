// Import the Habit and HabitLog models to query database records
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// Import our rule-based AI coaching logic helper function
const { generateInsightsForHabit } = require('../utils/aiInsightsLogic');

// @desc    Get rule-based behavioral insights and coaching tips for all user habits
// @route   GET /api/insights
// @access  Protected
const getAllInsights = async (req, res) => {
  // Fetch all habits belonging strictly to the currently logged-in user
  const habits = await Habit.find({ user: req.user._id });

  // Extract all individual habit IDs into an array list
  const habitIds = habits.map((h) => h._id);

  // Fetch tracking logs for ALL of the user's habits in one single database query for high performance
  const allLogs = await HabitLog.find({ habitId: { $in: habitIds } });

  // Loop through each habit and generate custom behavioral insights using our AI logic helper
  const insights = habits.map((habit) => {
    // Filter out only the logs that belong exclusively to this specific habit
    const habitLogs = allLogs.filter(
      (log) => log.habitId.toString() === habit._id.toString()
    );

    // Pass the habit details and its specific logs into our AI generator function
    return generateInsightsForHabit(habit, habitLogs);
  });

  // Return the final successful JSON response containing all generated coaching insights
  res.status(200).json({
    success: true,
    count: insights.length,
    data: insights
  });
};

// @desc    Get rule-based behavioral insights for a single specific habit
// @route   GET /api/insights/:habitId
// @access  Protected
const getSingleHabitIndights = async (req, res) => {
  // Find the specific habit by ID from the URL parameters
  const habit = await Habit.findById(req.params.habitId);

  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  // Security check: Ensure the logged-in user owns this habit
  if (habit.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this habit');
  }

  // Fetch tracking logs for this specific habit
  const habitLogs = await HabitLog.find({ habitId: habit._id });

  // Generate the insight for this single habit
  const insight = generateInsightsForHabit(habit, habitLogs);

  res.status(200).json({
    success: true,
    data: insight
  });
};

// Export both controller functions so they match your route file imports
module.exports = {
  getAllInsights,
  getSingleHabitIndights
};