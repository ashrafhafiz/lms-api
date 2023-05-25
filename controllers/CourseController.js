const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const Course = require("../models/CourseModel");

// Get all courses
exports.getCourses = asyncHandler(async (req, res) => {
  // Get the search query parameter
  const search = req.query.search || "";

  // Get the filtering criteria from query parameters
  const filters = {};
  if (req.query.category) {
    filters.category = req.query.category;
  }
  // Add more filters as needed

  // Construct the query object
  const query = {
    $and: [
      // Apply search on title and description fields
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
      // Apply additional filters
      filters,
    ],
  };

  // Sorting & Pagination
  const { page, limit, sortby, order } = req.query;
  const sortCriteria = { [sortby]: order === "desc" ? -1 : 1 };
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 5;
  const skip = (pageNumber - 1) * pageSize;

  const courses = await Course.find(query)
    .sort(sortCriteria)
    .skip(skip)
    .limit(pageSize)
    .select("title description instructors assistants students");

  // Get the total count of courses
  const totalCount = await Course.countDocuments();
  res.json({
    courses,
    queryCount: courses.length,
    page: pageNumber,
    limit: pageSize,
    totalCount,
  });
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
