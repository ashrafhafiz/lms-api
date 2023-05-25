const express = require("express");
const router = express.Router();
const CourseController = require("../controllers/CourseController");

// GET /courses     Get all courses
// POST /courses    Create a course
router
  .route("/courses")
  .get(CourseController.getCourses)
  .post(CourseController.createCourse);

// GET /courses/:courseId       Get a course by ID
// PUT /courses/:courseId       Update a course by ID
// DELETE /courses/:courseId    Delete a course by ID
router
  .route("/courses/:courseId")
  .get(CourseController.getCourse)
  .put(CourseController.updateCourse)
  .delete(CourseController.deleteCourse);

module.exports = router;
