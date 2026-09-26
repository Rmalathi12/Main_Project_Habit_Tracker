import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Register new user account with input validation
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validate that the name field does not contain an email symbol or look like an email
    if (name.includes("@") || name.includes(".")) {
      setError("Please enter a valid full name, not an email address.");
      return;
    }

    // Optional: Validate name format (only letters and spaces allowed)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      setError("Full Name should only contain letters and spaces.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const { data } = await API.post("/auth/signup", {
        name,
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/onboarding/goals");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-md shadow-sm"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Create Account
        </h2>
        {error && (
          <p className="text-rose-500 text-sm mb-4 font-medium text-center">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-slate-700 text-sm font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-700 text-sm font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-700 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm mb-4"
        >
          Signup
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
