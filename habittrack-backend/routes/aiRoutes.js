const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

// Initialize the Gemini client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/ai-coach", async (req, res) => {
  try {
    const { username, habits } = req.body;

    // Dynamically resolve display name
    const displayName = username && username.trim() !== "" ? username : "there";
    const userHabitList = Array.isArray(habits) ? habits : [];
    const completedHabits = userHabitList.filter((h) => h.completed).length;
    const totalHabits = userHabitList.length;

    const prompt = `You are a personalized, encouraging AI habit coach. Here is the habit data for ${displayName}:
- Total Habits Today: ${totalHabits}
- Completed Today: ${completedHabits}
- Habits Breakdown: ${JSON.stringify(userHabitList)}

Write 2-3 short, highly engaging, and personalized sentences of advice acknowledging their specific habits and consistency. Address them directly by name. Do not use generic filler.`;

    let adviceText = "";

    try {
      // SDK call for @google/genai
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      // Extract text safely from response
      adviceText =
        response.text ||
        (response.candidates &&
          response.candidates[0]?.content?.parts?.[0]?.text);
    } catch (apiErr) {
      console.error("Gemini API live call error:", apiErr);
    }

    // Dynamic context-aware response if live model call encounters issues
    if (!adviceText) {
      if (completedHabits === totalHabits && totalHabits > 0) {
        adviceText = `Incredible job today, ${displayName}! You've completely aced all ${totalHabits} of your habits. Your consistency is building an unstoppable foundation!`;
      } else {
        adviceText = `Keep pushing forward, ${displayName}! You have completed ${completedHabits} out of ${totalHabits} habits today. Stay focused on your remaining daily goals!`;
      }
    }

    return res.json({
      success: true,
      advice: adviceText.trim(),
    });
  } catch (error) {
    console.error("AI Coach route error:", error);
    return res.status(500).json({
      success: false,
      advice:
        "Keep up the great work! Consistency is key to reaching your goals.",
    });
  }
});

module.exports = router;
