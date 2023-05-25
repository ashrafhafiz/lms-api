const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");
const Enrollment = require("../models/EnrollmentModel");

// Enroll user as a student in a course
exports.enrollUserInCourse = asyncHandler(async (req, res, next) => {
  const { userId, courseId, role } = req.body;

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");

  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) throw createError(404, "Course not found");

  // Check if the user is already enrolled in the course
  const existingEnrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });
  if (existingEnrollment)
    throw createError(400, "User is already enrolled in the course");

  // Create a new enrollment
  const enrollment = new Enrollment({
    user: userId,
    course: courseId,
    role,
    // Additional fields related to enrollment
  });

  // Save the enrollment
  await enrollment.save();

  return res
    .status(200)
    .json({ message: "User enrolled in the course successfully" });
});

// Withdraw user from a course
exports.withdrawUserFromCourse = asyncHandler(async (req, res, next) => {
  const { userId, courseId } = req.body;

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");

  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) throw createError(404, "Course not found");

  // Find the enrollment document for the user and course
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  // If the enrollment does not exist, return an error
  if (!enrollment) throw createError(404, "Enrollment not found");

  // Remove the enrollment from the database
  await enrollment.remove();

  return res
    .status(200)
    .json({ message: "User withdrawn from the course successfully" });
});

// Retrieve all courses a user is enrolled in
exports.getUserCourses = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");

  // Retrieve the enrolled courses for the user
  const enrolledCourses = await Enrollment.find({ user: userId })
    .select("course")
    .populate("course", "title");

  return res.status(200).json({
    message: "Enrolled courses retrieved successfully",
    courses: enrolledCourses,
  });
});

// Find all users enrolled in a specific course
exports.getCourseUsers = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  // Find the course by ID
  const course = await Course.findById(courseId);
  if (!course) throw createError(404, "Course not found");

  // Retrieve the enrolled users for the course
  const enrolledUsers = await Enrollment.find({
    course: courseId,
  }).populate("user", "firstName lastName email role");

  const enrolledUsersAsStudents = enrolledUsers.filter(
    (user) => user.role === "student"
  );
  const enrolledUsersAsAssistants = enrolledUsers.filter(
    (user) => user.role === "assistant"
  );
  const enrolledUsersAsInstructors = enrolledUsers.filter(
    (user) => user.role === "instructor"
  );

  return res.status(200).json({
    message: "Enrolled users retrieved successfully",
    enrolledUsersAsStudents,
    enrolledUsersAsAssistants,
    enrolledUsersAsInstructors,
  });
});

// Update user role
exports.updateUserRoleInCourse = asyncHandler(async (req, res, next) => {
  try {
    const enrollmentId = req.params.enrollmentId;
    const newRole = req.body.role;

    // Find the enrollment by ID
    const enrollment = await Enrollment.findById(enrollmentId);

    // Update the role of the user in the course
    enrollment.role = newRole;
    await enrollment.save();

    return res.status(200).json({
      message: "User role in course updated successfully",
      enrollment: enrollment,
    });
  } catch (error) {
    return next(error);
  }
});
