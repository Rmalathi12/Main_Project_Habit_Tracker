const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register new user
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check missing required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Validate full name format (prevent emails or special symbols in name)
  if (cleanName.includes("@") || cleanName.includes(".")) {
    res.status(400);
    throw new Error("Please enter a valid full name, not an email address");
  }

  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(cleanName)) {
    res.status(400);
    throw new Error("Full name should only contain letters and spaces");
  }

  // Validate password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: cleanEmail });
  if (userExists) {
    res.status(409);
    throw new Error("User already exists with this email");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name: cleanName,
    email: cleanEmail,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Added role so frontend recognizes admin privileges
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const cleanEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: cleanEmail });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Added role so frontend recognizes admin privileges
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

// Get current user profile
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

module.exports = { signupUser, loginUser, getMe };
