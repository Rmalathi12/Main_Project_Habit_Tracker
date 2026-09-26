const express = require("express");
const router = express.Router();
const { getHabitProgress, getDashboardSummary } = require(
  "../controllers/progressController",
);
const { protect } = require("../middleware/authMiddleware");

// routes for progress and dashboard metrics(protected)
router.get("/habits/:id/progress", protect, getHabitProgress);
router.get("/dashboard", protect, getDashboardSummary);

module.exports = router;
