// Generate smart suggestions based on user habits count and patterns
export const generateAiInsights = (habits = []) => {
  if (!habits || habits.length === 0) {
    return "Start adding habits to receive personalized AI productivity insights!";
  }

  if (habits.length >= 3) {
    return "You are maintaining an active habit schedule! Try setting reminder alerts in the evening for even better completion rates.";
  } else {
    return `You have ${habits.length} active habit(s). Consider adding a few more goals to maximize your daily consistency score.`;
  }
};