import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, TrendingUp } from "lucide-react";
import API from "../services/api";

const RECOMMENDATIONS = {
  health: {
    title: "Health & Fitness",
    habits: [
      "Morning Exercise",
      "Drink 8 glasses of water",
      "Get 8 hours of sleep",
    ],
  },
  mindfulness: {
    title: "Mindfulness",
    habits: ["Mediate for 10 minutes", "Practice gratitude", "Deep breathing"],
  },
  productivity: {
    title: "Productivity",
    habits: ["Plan tomorrow", "No phone 1st hour", "Review daily goals"],
  },
  learning: {
    title: "Learning",
    habits: [
      "Read for 20 minutes",
      "Learn new language",
      "Take an online course",
    ],
  },
  creativity: {
    title: "Creativity",
    habits: ["Write in journal", "Draw or sketch", "Practice instrument"],
  },
  social: {
    title: "Social",
    habits: ["Call a friend", "Quality time with family", "Join a community"],
  },
};

export default function OnboardingHabits() {
  const location = useLocation();
  const navigate = useNavigate();

  // Guard against missing state if user refreshed the page directly
  const selectedCategories = location.state?.selectedCategories || [
    "health",
    "productivity",
  ];

  const allRecommendedHabits = [];
  selectedCategories.forEach((catKey) => {
    if (RECOMMENDATIONS[catKey]) {
      RECOMMENDATIONS[catKey].habits.forEach((habitName) => {
        allRecommendedHabits.push(habitName);
      });
    }
  });

  const [selectedHabits, setSelectedHabits] = useState(() => {
    const initial = {};
    allRecommendedHabits.forEach((habit) => {
      initial[habit] = false;
    });
    return initial;
  });

  const [loading, setLoading] = useState(false);

  const toggleHabit = (habitName) => {
    setSelectedHabits((prev) => ({
      ...prev,
      [habitName]: !prev[habitName],
    }));
  };

  const handleGetStarted = async () => {
    const habitsToCreate = Object.keys(selectedHabits).filter(
      (h) => selectedHabits[h],
    );

    if (habitsToCreate.length === 0) {
      alert("Please select at least one habit to track.");
      return;
    }

    setLoading(true);
    try {
      // Loop and save each selected habit
      for (const title of habitsToCreate) {
        await API.post("/habits", {
          title,
          category: "General",
          frequency: "daily",
        });
      }
      // Force navigation to the dashboard root
      navigate("/", { replace: true });
    } catch (err) {
      console.error(
        "Error saving initial habits:",
        err.response?.data || err.message,
      );
      alert(
        err.response?.data?.message ||
          "Error saving initial habits. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4">
      <div className="max-w-xl mx-auto w-full">
        {/* Top Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-8 h-1.5 bg-slate-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-indigo-600 rounded-full"></div>
          <div className="w-8 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        {/* Icon Header */}
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-xs">
          <TrendingUp className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">
          Start with these habits
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 mb-8 text-center">
          Based on your goals, we recommend these habits (select any you'd like
          to track)
        </p>

        {/* Unified List of Recommendations */}
        <div className="space-y-3">
          {allRecommendedHabits.map((habitName) => {
            const isChecked = !!selectedHabits[habitName];
            return (
              <div
                key={habitName}
                onClick={() => toggleHabit(habitName)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                  isChecked
                    ? "border-indigo-600 shadow-sm ring-2 ring-indigo-600/10 text-slate-900 font-semibold"
                    : "border-slate-200/80 hover:border-slate-300 text-slate-600"
                }`}
              >
                <span className="text-sm">{habitName}</span>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    isChecked
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          You can always add or remove habits later
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="max-w-xl mx-auto w-full flex items-center gap-4 mt-10">
        <button
          onClick={() => navigate(-1)}
          className="w-1/2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-xl transition-all shadow-xs"
        >
          Back
        </button>
        <button
          onClick={handleGetStarted}
          disabled={loading}
          className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}
