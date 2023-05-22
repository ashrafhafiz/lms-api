const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");

// Get all users
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select(
    "firstName lastName role enrolledCourses"
  );
  res.json(users);
});

// Get a specific user
exports.getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found");
  }
  res.json(user);
});

// Update a user
exports.updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true }
  );
  if (!updatedUser) {
    throw createError(404, "User not found");
  }
  res.json(updatedUser);
});

// Delete a user
exports.deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const deletedUser = await User.deleteOne({ _id: userId });
  if (!deletedUser) {
    throw createError(404, "User not found");
  }
  res.json({ message: "User deleted successfully" });
});

// Enroll in a course
exports.enrollCourse = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;

  // Find the user and the course
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!user || !course) {
    throw createError(404, "User or course not found");
  }

  // Check if the user is already enrolled in the course
  if (user.enrolledCourses.includes(courseId)) {
    throw createError(409, "User is already enrolled in the course");
  }

  // Enroll the user in the course
  user.enrolledCourses.push(courseId);
  await user.save();

  // Update the course's students array
  course.students.push(userId);
  await course.save();

  res.json({ message: "User enrolled in the course" });
});

// Withdraw from a course
exports.withdrawCourse = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;

  // Find the user and the course
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!user || !course) {
    throw createError(404, "User or course not found");
  }

  // Check if the user is enrolled in the course
  if (!user.enrolledCourses.includes(courseId)) {
    throw createError(409, "User is not enrolled in the course");
  }

  // Withdraw the user from the course
  user.enrolledCourses = user.enrolledCourses.filter(
    (enrolledCourse) => enrolledCourse.toString() !== courseId
  );
  await user.save();

  // Update the course's students array
  course.students = course.students.filter(
    (student) => student.toString() !== userId
  );
  await course.save();

  res.json({ message: "User withdrawn from the course" });
});
