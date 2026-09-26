import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  HeartPulse,
  Zap,
  BookOpen,
  Palette,
  Users,
  Target,
} from "lucide-react";

const GOAL_CATEGORIES = [
  {
    id: "health",
    title: "Health & Fitness",
    icon: Dumbbell,
    defaultHabit: "Morning Exercise",
  },
  {
    id: "mindfulness",
    title: "Mindfulness",
    icon: HeartPulse,
    defaultHabit: "Meditate for 10 mins",
  },
  {
    id: "productivity",
    title: "Productivity",
    icon: Zap,
    defaultHabit: "Review daily goals",
  },
  {
    id: "learning",
    title: "Learning",
    icon: BookOpen,
    defaultHabit: "Read for 20 minutes",
  },
  {
    id: "creativity",
    title: "Creativity",
    icon: Palette,
    defaultHabit: "Write in journal",
  },
  {
    id: "social",
    title: "Social",
    icon: Users,
    defaultHabit: "Connect with a friend",
  },
];

export default function OnboardingGoals() {
  const [selected, setSelected] = useState(["health"]);
  const navigate = useNavigate();

  const toggleCategory = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      alert("Please select at least one area to improve.");
      return;
    }

    // Pass the selected categories state to the habit selection page
    navigate("/onboarding/habits", { state: { selectedCategories: selected } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4">
      <div className="max-w-xl mx-auto w-full text-center">
        {/* Top Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-8 h-1.5 bg-indigo-600 rounded-full"></div>
          <div className="w-8 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        {/* Target Icon Header */}
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-xs">
          <Target className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          What are your goals?
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 mb-8">
          Select the areas you want to improve (choose at least one)
        </p>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {GOAL_CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.id);
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 bg-white ${
                  isSelected
                    ? "border-indigo-600 shadow-md ring-2 ring-indigo-600/10"
                    : "border-slate-200/80 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{cat.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isSelected ? "Selected" : "Click to select"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="max-w-xl mx-auto w-full flex items-center gap-4 mt-10">
        <button
          onClick={() => navigate("/login")}
          className="w-1/2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}