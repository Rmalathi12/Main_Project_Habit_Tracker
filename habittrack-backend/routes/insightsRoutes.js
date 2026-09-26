const express = require("express");
const router = express.Router();
const {
  getAllInsights,
  getSingleHabitIndights,
} = require("../controllers/insightsController");
const { protect } = require("../middleware/authMiddleware");

// routes for AI insights(Protected)
router.get("/", protect, getAllInsights);
router.get("/:habitId", protect, getSingleHabitIndights);

module.exports = router;
