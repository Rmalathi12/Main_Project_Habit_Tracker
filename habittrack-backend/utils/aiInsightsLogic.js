// Import the helper function to check whether a given date is a weekday (Monday to Friday)
const { isWeekday } = require("./dateHelpers");

/**
 * Analyzes a user's habit tracking logs to generate rule-based behavioral insights.
 * @param {Object} habit - The habit document containing title, id, etc.
 * @param {Array} logs - List of tracking log entries associated with the habit.
 * @returns {Object} An insight object containing stats and a custom coaching message.
 */
const generateInsightsForHabit = (habit, logs) => {
  // Check if there are no tracking logs yet; if so, return a friendly starter message
  if (!logs || logs.length === 0) {
    return {
      habitId: habit._id,
      title: habit.title,
      insight:
        "Not enough data yet. Start tracking daily to unlock tailored insights!",
    };
  }

  // Initialize counter variables to 0 to store total and completed days for weekdays vs weekends
  let weekdayTotal = 0; // Total weekdays tracked
  let weekdayCompleted = 0; // Weekdays the habit was successfully completed
  let weekendTotal = 0; // Total weekend days tracked
  let weekendCompleted = 0; // Weekend days the habit was successfully completed

  // Loop through every single tracking log entry in the history
  logs.forEach((log) => {
    // Check if the log's date falls on a weekday (Monday to Friday)
    if (isWeekday(log.date)) {
      weekdayTotal++; // Increase total weekday counter by 1

      // If the habit was completed on this weekday, increase completed weekday counter by 1
      if (log.completed) {
        weekdayCompleted++;
      }
    } else {
      // If it is not a weekday, it falls on a weekend (Saturday or Sunday)
      weekendTotal++; // Increase total weekend counter by 1

      // If the habit was completed on this weekend day, increase completed weekend counter by 1
      if (log.completed) {
        weekendCompleted++;
      }
    }
  });

  // Calculate the success completion rate percentage for weekdays (avoiding division by zero)
  const weekdayRate =
    weekdayTotal > 0 ? (weekdayCompleted / weekdayTotal) * 100 : 0;

  // Calculate the success completion rate percentage for weekends (avoiding division by zero)
  const weekendRate =
    weekendTotal > 0 ? (weekendCompleted / weekendTotal) * 100 : 0;

  // Variable to store the final generated coaching suggestion
  let message = "";

  // Check if there is enough data (at least 3 weekdays and 2 weekends) and a big difference (>20%) between rates
  if (
    weekdayTotal >= 3 &&
    weekendTotal >= 2 &&
    Math.abs(weekdayRate - weekendRate) > 20
  ) {
    if (weekdayRate > weekendRate) {
      // Case 1: User is much more consistent on weekdays than weekends
      message = `You are significantly more consistent on weekdays (${Math.round(weekdayRate)}%) compared to weekends (${Math.round(weekendRate)}%). Try setting a gentle weekend reminder!`;
    } else {
      // Case 2: User is much more consistent on weekends than weekdays
      message = `Great job on weekends (${Math.round(weekendRate)}%)! Consider bringing that same momentum into your weekdays.`;
    }
  } else {
    // Case 3: Performance is balanced or there isn't a stark contrast yet
    message = `You are maintaining a steady rhythm. Keep logging daily to improve your overall consistency!`;
  }

  // Return the final structured package containing the habit info, calculated stats, and insight message
  return {
    habitId: habit._id,
    title: habit.title,
    stats: {
      totalLoggedDays: logs.length,
      weekdayCompletionRate: `${Math.round(weekdayRate)}%`,
      weekendCompletionRate: `${Math.round(weekendRate)}%`,
    },
    insight: message,
  };
};

// Export the function so it can be imported and used inside the insights controller
module.exports = { generateInsightsForHabit };
