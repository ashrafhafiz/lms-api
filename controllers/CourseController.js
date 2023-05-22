const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const Course = require("../models/CourseModel");
const User = require("../models/UserModel");

// Get all courses
exports.getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Get a specific course
exports.getCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw createError(404, "Course not found");
  }
  res.json(course);
});

// Create a course
exports.createCourse = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Check if the course already exists
  const existingCourse = await Course.findOne({ title });
  if (existingCourse) {
    throw createError(409, "Course already exists");
  }

  const newCourse = await Course.create({ title, description });
  res.status(201).json(newCourse);
});

// Update a course
exports.updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description } = req.body;
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { title, description },
    { new: true }
  );
  if (!updatedCourse) {
    throw createError(404, "Course not found");
  }
  res.json(updatedCourse);
});

// Delete a course
exports.deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const deletedCourse = await Course.findByIdAndDelete(courseId);
  if (!deletedCourse) {
    throw createError(404, "Course not found");
  }
  res.json({ message: "Course deleted successfully" });
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
