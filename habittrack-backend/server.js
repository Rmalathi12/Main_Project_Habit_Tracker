const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Forces public DNS resolvers
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// load environment variables from .env file
dotenv.config();

// connect to mongoDB DB
connectDB();

const app = express();

// enable cross-origin resource sharing (CORS) securely with trailing slash normalization
const frontendUrl = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.replace(/\/$/, "")
  : "";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  frontendUrl,
].filter(Boolean); // Filters out undefined values if FRONTEND_URL isn't set yet

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin) return callback(null, true);

      // Normalize incoming origin by removing any trailing slash
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

// middleware to parse incoming JSON request bodies
app.use(express.json());

// rate limiter: limit requests on auth routes to prevent brute-force attacks (max 20 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// mount all API routes
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));
app.use("/api/habits", require("./routes/trackingRoutes"));
app.use("/api", require("./routes/progressRoutes"));
app.use("/api/insights", require("./routes/insightsRoutes"));
// Mount the routes
app.use("/api/users", userRoutes);

// root endpoint for health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HabitTrack API is running successfully",
  });
});

// Centralized error-handling middleware (must be last middleware loaded before listen)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start the server globally
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
