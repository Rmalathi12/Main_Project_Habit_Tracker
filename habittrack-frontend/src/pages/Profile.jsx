import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Abi",
    email: "abi@gmail.com",
    joinedDate: "January 2026",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("Abi");
  const navigate = useNavigate();

  useEffect(() => {
    // Check all potential storage keys used during login/signup
    const storedUserStr =
      localStorage.getItem("user") ||
      localStorage.getItem("userInfo") ||
      localStorage.getItem("userData");

    const standaloneEmail = localStorage.getItem("email");
    const standaloneName =
      localStorage.getItem("name") || localStorage.getItem("username");

    let parsedName = standaloneName || "Abi";
    let parsedEmail = standaloneEmail || "abi@gmail.com";
    let parsedDate = "January 2026";

    if (storedUserStr) {
      try {
        const parsed = JSON.parse(storedUserStr);
        parsedName = parsed.name || parsed.username || parsedName;
        parsedEmail = parsed.email || parsedEmail;
        parsedDate = parsed.joinedDate || parsedDate;
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }

    setUser({
      name: parsedName,
      email: parsedEmail,
      joinedDate: parsedDate,
    });
    setNameInput(parsedName);
  }, []);

  // Extract the first letter of the username safely (uppercase)
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "A";

  const handleSave = () => {
    setUser((prev) => ({ ...prev, name: nameInput }));
    const storedUser = localStorage.getItem("user");
    let parsed = storedUser ? JSON.parse(storedUser) : {};
    parsed.name = nameInput;
    localStorage.setItem("user", JSON.stringify(parsed));
    localStorage.setItem("name", nameInput);

    // Dispatch custom event to update Navbar instantly
    window.dispatchEvent(new Event("profileUpdated"));

    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <main className="max-w-3xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-semibold mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Profile Settings
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your personal account details and profile information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Avatar & Dynamic First Letter Section */}
          <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 bg-indigo-600 text-white font-black text-3xl rounded-2xl flex items-center justify-center shadow-md">
              {firstLetter}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-lg">
                Active Member
              </span>
            </div>
          </div>

          {/* User Information Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Full Name
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="block mt-1 px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:outline-indigo-600 w-64"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {user.name}
                  </p>
                )}
              </div>

              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
                </span>
                <p className="text-sm font-bold text-slate-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Member Since
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {user.joinedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <Shield className="w-5 h-5 text-slate-400" />
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Account Security
                </span>
                <p className="text-sm font-bold text-emerald-600">
                  Protected & Encrypted
                </p>
              </div>
            </div>
          </div>

          {/* Logout Action Inside Profile */}
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Need to leave your account?
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
