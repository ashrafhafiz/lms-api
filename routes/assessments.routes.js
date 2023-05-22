const express = require("express");
const router = express.Router();
const AssessmentController = require("../controllers/AssessmentController");

// GET /courses/:courseId/assessments
router.get(
  "/courses/:courseId/assessments",
  AssessmentController.getAssessmentsByCourse
);

// GET /assessments/:assessmentId
router.get("/assessments/:assessmentId", AssessmentController.getAssessment);

// POST /assessments
router.post("/assessments", AssessmentController.createAssessment);

// PUT /assessments/:assessmentId
router.put("/assessments/:assessmentId", AssessmentController.updateAssessment);

// DELETE /assessments/:assessmentId
router.delete(
  "/assessments/:assessmentId",
  AssessmentController.deleteAssessment
);

module.exports = router;
