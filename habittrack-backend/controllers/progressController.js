// Import the Habit and HabitLog models to query database records
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

/**
 * Helper function to calculate progress metrics (streaks and completion rates) from an array of tracking logs.
 * @param {Array} logs - List of tracking log entries for a habit.
 * @returns {Object} Calculated metrics including current streak, completion rate, and totals.
 */
const calculateMetrics = (logs) => {
  // If no logs exist yet, return default baseline numbers (0 streak, 0% rate)
  if (!logs || logs.length === 0) {
    return { currentStreak: 0, completionRate: '0%', totalTrackedDays: 0, totalCompletedDays: 0 };
  }

  // Sort logs by date in descending order (newest date first, e.g., Monday before Sunday)
  // This is essential because calculating a consecutive streak requires looking backward from today.
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

  let currentStreak = 0;
  let completedCount = 0;
  const totalTracked = sortedLogs.length;

  // Count how many total days the habit was marked completed across all logs
  sortedLogs.forEach((log) => {
    if (log.completed) completedCount++;
  });

  // Calculate the consecutive current streak starting from the most recent day backward
  for (const log of sortedLogs) {
    if (log.completed) {
      currentStreak++; // Add 1 to streak if the day was completed
    } else {
      break; // Stop counting immediately if an uncompleted day breaks the chain
    }
  }

  // Calculate overall completion success percentage (avoiding division by zero)
  const rate = totalTracked > 0 ? Math.round((completedCount / totalTracked) * 100) : 0;

  // Return the compiled performance metrics package
  return {
    currentStreak,
    completionRate: `${rate}%`,
    totalTrackedDays: totalTracked,
    totalCompletedDays: completedCount
  };
};

// @desc    Get progress stats and history for a single habit
// @route   GET /api/habits/:id/progress
// @access  Protected
const getHabitProgress = async (req, res) => {
  // Find the specific habit by its ID from the URL parameters
  const habit = await Habit.findById(req.params.id);
  
  // If habit does not exist, return 404 error
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  // Security check: Ensure the logged-in user owns this habit
  if (habit.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Fetch all tracking logs associated with this habit
  const logs = await HabitLog.find({ habitId: habit._id });
  
  // Run our helper function to compute streaks and rates
  const metrics = calculateMetrics(logs);

  // Return the final progress report card JSON response
  res.status(200).json({
    success: true,
    data: {
      habitId: habit._id,
      title: habit.title,
      ...metrics, // Spreads currentStreak, completionRate, etc. into the object
      history: logs
    }
  });
};

// @desc    Get aggregated dashboard summary across all of the user's habits
// @route   GET /api/dashboard
// @access  Protected
const getDashboardSummary = async (req, res) => {
  // Find all habits belonging strictly to the logged-in user
  const habits = await Habit.find({ user: req.user._id });
  
  // Extract all habit IDs into an array
  const habitIds = habits.map((h) => h._id);

  // Fetch tracking logs for ALL of the user's habits in one single database query for performance
  const allLogs = await HabitLog.find({ habitId: { $in: habitIds } });

  let totalHabits = habits.length;

  // Map through each habit and calculate its individual metrics using the fetched logs
  let habitSummaries = habits.map((habit) => {
    // Filter out only the logs that belong to this specific habit
    const habitLogs = allLogs.filter((log) => log.habitId.toString() === habit._id.toString());
    
    // Compute metrics for this individual habit
    const metrics = calculateMetrics(habitLogs);
    
    return {
      habitId: habit._id,
      title: habit.title,
      frequency: habit.frequency,
      ...metrics
    };
  });

  // Return the comprehensive dashboard summary JSON response
  res.status(200).json({
    success: true,
    data: {
      totalHabits,
      habits: habitSummaries
    }
  });
};

// Export controller functions so they can be hooked up to routes
module.exports = {
  getHabitProgress,
  getDashboardSummary
};