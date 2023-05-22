const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const Assessment = require("../models/AssessmentModel");

// Get assessments by course
exports.getAssessmentsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const assessments = await Assessment.find({ courseId });
  res.json(assessments);
});

// Get a specific assessment
exports.getAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    throw createError(404, "Assessment not found");
  }
  res.json(assessment);
});

// Create an assessment
exports.createAssessment = asyncHandler(async (req, res) => {
  const { courseId, title, description, questions } = req.body;
  const newAssessment = await Assessment.create({
    courseId,
    title,
    description,
    questions,
  });
  res.status(201).json(newAssessment);
});

// Update an assessment
exports.updateAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const { title, description, questions } = req.body;
  const updatedAssessment = await Assessment.findByIdAndUpdate(
    assessmentId,
    { title, description, questions },
    { new: true }
  );
  if (!updatedAssessment) {
    throw createError(404, "Assessment not found");
  }
  res.json(updatedAssessment);
});

// Delete an assessment
exports.deleteAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const deletedAssessment = await Assessment.findByIdAndDelete(assessmentId);
  if (!deletedAssessment) {
    throw createError(404, "Assessment not found");
  }
  res.json({ message: "Assessment deleted successfully" });
});
