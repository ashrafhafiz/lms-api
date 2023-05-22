const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Register a new user
exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, "User already exists");
  }

  // Create a new user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  // Generate a JWT token
  const token = generateToken(user._id);

  // Return the user and token
  res.status(201).json({ user, token });
});

// Log in an existing user
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  // Validate the provided password
  const isPasswordValid = await User.validatePassword(password, user.password);
  if (!isPasswordValid) {
    throw createError(401, "Invalid email or password");
  }

  // Generate a JWT token
  const token = generateToken(user._id);

  // Update last login timestamp
  await user.updateLastLogin();

  const userInfo = {
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    enrolledCourses: user.enrolledCourses,
  };

  // Return the user and token
  res.json({ userInfo, token });
});

// Generate a JWT token
function generateToken(userId) {
  // Generate a token with the user ID as the payload
  const token = jwt.sign({ userId }, "your-secret-key", { expiresIn: "1h" });
  return token;
}
