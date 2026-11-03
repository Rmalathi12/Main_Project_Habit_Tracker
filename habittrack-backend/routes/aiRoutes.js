const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

// Initialize the Google Gen AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generation function targeting available flash and pro model aliases
async function generateSmartAdvice(prompt) {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];

  for (const model of modelsToTry) {
    try {
      console.log(`[AI Coach] Attempting generation with model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (error) {
      console.warn(
        `[AI Coach] Model ${model} unavailable (${error.status || error.message}). Trying next...`
      );
    }
  }

  // Failsafe response when models are saturated or rate-limited
  return "Great effort on staying consistent! Small daily wins build massive long-term habits. Keep checking off your daily goals!";
}

// Mounted at POST /api/ai-coach
router.post("/ai-coach", async (req, res) => {
  try {
    const { username, habits } = req.body;

    const prompt = `You are a supportive, motivating AI habit coach. Here is the habit data for user ${username || "User"}: ${JSON.stringify(
      habits || []
    )}. Analyze their streaks and consistency, and provide 2-3 short, highly encouraging, and actionable pieces of advice to help them stay on track. Keep the tone friendly and concise.`;

    const adviceText = await generateSmartAdvice(prompt);

    return res.status(200).json({
      success: true,
      advice: adviceText,
    });
  } catch (error) {
    console.error("[AI Coach Route Error]:", error);
    return res.status(200).json({
      success: true,
      advice:
        "Every day is a fresh opportunity to build strong routines. Stay consistent with your active habits and keep moving forward!",
    });
  }
});

module.exports = router;