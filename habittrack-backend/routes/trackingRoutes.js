const express = require("express");
const router = express.Router();
const {
  trackHabitDate,
  getHabitLogs,
} = require("../controllers/trackingController");
const { protect } = require("../middleware/authMiddleware");

// route to mark habit completion and get tracking history
router
  .route("/:id/track")
  .post(protect, trackHabitDate)
  .get(protect, getHabitLogs);

module.exports = router;
