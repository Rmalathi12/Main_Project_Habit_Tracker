import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Authenticate user credentials against backend
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });

      // Store complete user info object
      localStorage.setItem("userInfo", JSON.stringify(data));

      // CRITICAL: Explicitly extract and save the token as a standalone key
      const token = data.token || data.accessToken || data.jwt;
      if (token) {
        localStorage.setItem("token", token);
      }

      navigate("/onboarding/goals");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-md shadow-sm"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Welcome Back
        </h2>
        {error && (
          <p className="text-rose-500 text-sm mb-4 font-medium text-center">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-slate-700 text-sm font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
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
          Login
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
