const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");

// Enroll user as a student in a course
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

// Withdraw student from a course
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

// Add an instructor to a course
exports.addInstructor = asyncHandler(async (req, res, next) => {
  const { courseId, instructorId } = req.params;

  // Check if the user exists and has the role of an instructor
  const instructor = await User.findOne({
    _id: instructorId,
    role: "instructor",
  });
  if (!instructor) {
    throw createError(400, "User is not a valid instructor");
  }

  // Check if the instructor is already assigned to the course
  const course = await Course.findById(courseId);
  if (course.instructors.includes(instructorId)) {
    throw createError(400, "Instructor is already assigned to the course");
  }

  // Add the instructor to the course
  course.instructors.push(instructorId);
  await course.save();

  res.json(course);
});

// Remove an instructor from a course
exports.removeInstructor = asyncHandler(async (req, res, next) => {
  const { courseId, instructorId } = req.params;

  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw createError(404, "Course not found");
  }

  // Check if the instructor is assigned to the course
  if (!course.instructors.includes(instructorId)) {
    throw createError(400, "Instructor is not assigned to the course");
  }

  // Remove the instructor from the course
  course.instructors.pull(instructorId);
  await course.save();

  res.json(course);
});

// Add an assistant to a course
exports.addAssistant = asyncHandler(async (req, res, next) => {
  const { courseId, assistantId } = req.params;

  // Check if the user exists and has the role of an assistant
  const assistant = await User.findOne({
    _id: assistantId,
    role: "assistant",
  });
  if (!assistant) {
    throw createError(400, "User is not a valid assistant");
  }

  // Check if the assistant is already assigned to the course
  const course = await Course.findById(courseId);
  if (course.assistants.includes(assistantId)) {
    throw createError(400, "Assistant is already assigned to the course");
  }

  // Add the assistant to the course
  course.assistants.push(assistantId);
  await course.save();

  res.json(course);
});

// Remove an assistant from a course
exports.removeAssistant = asyncHandler(async (req, res, next) => {
  const { courseId, assistantId } = req.params;

  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw createError(404, "Course not found");
  }

  // Check if the assistant is assigned to the course
  if (!course.assistants.includes(assistantId)) {
    throw createError(400, "Assistant is not assigned to the course");
  }

  // Remove the assistant from the course
  course.assistants.pull(assistantId);
  await course.save();

  res.json(course);
});
