const express = require("express");
const router = express.Router();
const EnrollmentController = require("../controllers/EnrollmentController");

// PUT /courses/:courseId/instructors/:instructorId         Add an instructor to a course
// DELETE /courses/:courseId/instructors/:instructorId      Remove an instructor to a course
// router
//   .route("/courses/:courseId/instructors/:instructorId")
//   .put(EnrollmentController.addInstructor)
//   .delete(EnrollmentController.removeInstructor);

// PUT /courses/:courseId/assistants/:instructorId          Add an assistant to a course
// DELETE /courses/:courseId/assistants/:instructorId       Remove an assistant to a course
// router
//   .route("/courses/:courseId/assistants/:assistantId")
//   .put(EnrollmentController.addAssistant)
//   .delete(EnrollmentController.removeAssistant);

// Enroll in a course
router.post(
  "/users/:userId/courses/:courseId/enroll",
  EnrollmentController.enrollUserInCourse
);

// Withdraw from a course
router.post(
  "/users/:userId/courses/:courseId/withdraw",
  EnrollmentController.withdrawUserFromCourse
);

// Get user's courses
router.get(
  "/enrollment/user_courses/:userId",
  EnrollmentController.getUserCourses
);

// Get course users
router.get(
  "/enrollment/course_users/:courseId",
  EnrollmentController.getCourseUsers
);
module.exports = router;
