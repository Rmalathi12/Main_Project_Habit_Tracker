const User = require("../models/User");

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500);
    throw new Error("Server error while fetching users");
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Prevent admin from deleting themselves accidentally
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot delete your own admin account");
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User removed successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Server error while deleting user");
  }
};

module.exports = { getUsers, deleteUser };