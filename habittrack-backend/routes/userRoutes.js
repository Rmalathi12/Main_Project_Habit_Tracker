const express = require("express");
const router = express.Router();
const { getUsers, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Route to fetch all users and delete a user (Admin only)
router.route("/").get(protect, admin, getUsers);
router.route("/:id").delete(protect, admin, deleteUser);

module.exports = router;