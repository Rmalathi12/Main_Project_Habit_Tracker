const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// public routes for user registration and login
router.post("/signup", signupUser);
router.post("/login", loginUser);

// protected route to fetch current logged-in user's profile
router.get("/me", protect, getMe);

module.exports = router;
