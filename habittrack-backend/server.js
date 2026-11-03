const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// Import route handlers
const aiRoutes = require("./routes/aiRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const progressRoutes = require("./routes/progressRoutes");
const insightsRoutes = require("./routes/insightsRoutes");

connectDB();

const app = express();

// Configure CORS
const frontendUrl = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.replace(/\/$/, "")
  : "";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  frontendUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// Rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// API Routes
app.use("/api", aiRoutes); // Endpoints: POST /api/ai-coach
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/habits", trackingRoutes);
app.use("/api", progressRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/users", userRoutes);

// Root health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HabitTrack API is running successfully",
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
