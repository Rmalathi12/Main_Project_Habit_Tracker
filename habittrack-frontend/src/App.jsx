import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/Calendar";
import AnalyticsView from "./pages/Analytics";
import ProfileView from "./pages/Profile";
import SettingsView from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddHabit from "./pages/AddHabit";
import EditHabit from "./pages/EditHabit";
import OnboardingGoals from "./pages/OnboardingGoals";
import OnboardingHabits from "./pages/OnboardingHabits";
import AdminDashboard from "./pages/AdminDashboard";

const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? children : <Navigate to="/login" replace />;
};

// Admin route guard to verify administrative privileges
const AdminRoute = ({ children }) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo && userInfo.role === "admin" ? (
      children
    ) : (
      <Navigate to="/dashboard" replace />
    );
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

// Component to handle layout and conditional Navbar rendering
function Layout() {
  const location = useLocation();
  // Hide global navbar on login, signup, onboarding, and admin pages
  const hideNavbarPaths = [
    "/login",
    "/signup",
    "/onboarding/goals",
    "/onboarding/habits",
    "/admin",
  ];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50">
      {showNavbar && <Navbar />}
      <Routes>
        {/* Root path redirection: Send to dashboard if logged in, otherwise to login */}
        <Route
          path="/"
          element={
            localStorage.getItem("userInfo") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Onboarding Flow */}
        <Route
          path="/onboarding/goals"
          element={
            <ProtectedRoute>
              <OnboardingGoals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/habits"
          element={
            <ProtectedRoute>
              <OnboardingHabits />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Protected application routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-habit"
          element={
            <ProtectedRoute>
              <AddHabit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-habit/:id"
          element={
            <ProtectedRoute>
              <EditHabit />
            </ProtectedRoute>
          }
        />

        {/* Fallback catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
