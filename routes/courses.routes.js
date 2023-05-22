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

// PUT /courses/:courseId/instructors/:instructorId         Add an instructor to a course
// DELETE /courses/:courseId/instructors/:instructorId      Remove an instructor to a course
router
  .route("/courses/:courseId/instructors/:instructorId")
  .put(CourseController.addInstructor)
  .delete(CourseController.removeInstructor);

// PUT /courses/:courseId/assistants/:instructorId          Add an assistant to a course
// DELETE /courses/:courseId/assistants/:instructorId       Remove an assistant to a course
router
  .route("/courses/:courseId/assistants/:assistantId")
  .put(CourseController.addAssistant)
  .delete(CourseController.removeAssistant);

module.exports = router;
