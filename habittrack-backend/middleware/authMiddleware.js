// Import JWT for token verification and User model
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect private routes by verifying JWT tokens
const protect = async (req, res, next) => {
  let token;

  // Check if the request header contains an Authorization token starting with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token string from 'Bearer <token>'
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key and decode user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the decoded ID and attach it to req.user (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next controller/middleware function
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If no token was found at all
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
};

module.exports = { protect };
