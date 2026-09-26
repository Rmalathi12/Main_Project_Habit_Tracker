const express = require("express");
const router = express.Router();
const {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  toggleHabit, 
} = require("../controllers/habitController");
const { protect } = require("../middleware/authMiddleware");

// routes for creating and listing habits (Protected)
router.route("/").post(protect, createHabit).get(protect, getHabits);

// routes for reading, updating, and deleting a single habit by ID (Protected)
router
  .route("/:id")
  .get(protect, getHabitById)
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

// Add the toggle route 
router.patch("/:id/toggle", protect, toggleHabit);

module.exports = router;