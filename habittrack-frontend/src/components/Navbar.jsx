import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  BarChart2,
  Settings,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInitial, setUserInitial] = useState("A");

  useEffect(() => {
    const updateInitial = () => {
      const storedUser =
        localStorage.getItem("user") || localStorage.getItem("userInfo");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const name =
            parsed.name ||
            parsed.username ||
            localStorage.getItem("name") ||
            "Abi";
          setUserInitial(name.charAt(0).toUpperCase());
        } catch (e) {
          setUserInitial("A");
        }
      } else {
        setUserInitial("A");
      }
    };

    updateInitial();

    // Listen for custom profile update events
    window.addEventListener("profileUpdated", updateInitial);
    return () => window.removeEventListener("profileUpdated", updateInitial);
  }, [location.pathname]);

  if (["/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xs">
      <div
        className="flex items-center gap-2 font-bold text-lg text-indigo-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
          ✨
        </div>
        HabitTrack
      </div>

      <nav className="hidden md:flex items-center gap-1">
        <button
          onClick={() => navigate("/")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
            isActive("/")
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => navigate("/calendar")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
            isActive("/calendar")
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <CalendarIcon className="w-4 h-4" /> Calendar
        </button>
        <button
          onClick={() => navigate("/analytics")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
            isActive("/analytics")
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Analytics
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <div
          onClick={() => navigate("/profile")}
          className={`w-9 h-9 font-semibold rounded-full flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 ${
            isActive("/profile")
              ? "bg-indigo-700 text-white ring-2 ring-indigo-600/30"
              : "bg-indigo-600 text-white"
          }`}
          title="Go to Profile"
        >
          {userInitial}
        </div>
        <button
          onClick={() => navigate("/settings")}
          className={`p-2 rounded-lg cursor-pointer transition-colors ${
            isActive("/settings")
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
          title="Go to Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
