import React, { useState } from "react";
import axios from "axios";

const AICoachCard = ({ username, habits }) => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAICoaching = async () => {
    setLoading(true);
    setError("");
    setAdvice("");

    try {
      // Adjust the URL if your backend runs on a different port or domain in production
      const response = await axios.post("http://localhost:5000/api/ai-coach", {
        username: username || "User",
        habits: habits || [],
      });

      if (response.data.success) {
        setAdvice(response.data.advice);
      }
    } catch (err) {
      console.error("Error fetching AI coach advice:", err);
      setError("Could not load AI coaching right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 border border-gray-100 dark:border-gray-700 my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            {/* Sparkles / AI Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            AI Habit Coach
          </h3>
        </div>
        <button
          onClick={fetchAICoaching}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loading ? "Analyzing..." : "Get Insights"}
        </button>
      </div>

      {/* Content Area */}
      {loading && (
        <div className="flex items-center justify-center py-6 text-gray-500 dark:text-gray-400 space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          <span className="text-sm">
            Reviewing your streaks and building tips...
          </span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {advice && !loading && (
        <div className="mt-4 p-4 bg-indigo-50/50 dark:bg-gray-700/50 rounded-lg border border-indigo-100 dark:border-gray-600">
          <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
            {advice}
          </p>
        </div>
      )}

      {!advice && !loading && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Click "Get Insights" to see personalized, AI-driven advice based on
          your current habit streaks.
        </p>
      )}
    </div>
  );
};

export default AICoachCard;
