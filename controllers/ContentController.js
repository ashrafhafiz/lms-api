const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const Content = require("../models/ContentModel");

// Get contents by course
exports.getContentsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const contents = await Content.find({ courseId });
  res.json(contents);
});

// Get a specific content
exports.getContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const content = await Content.findById(contentId);
  if (!content) {
    throw createError(404, "Content not found");
  }
  res.json(content);
});

// Create a content
exports.createContent = asyncHandler(async (req, res) => {
  const { courseId, title, description, contentData } = req.body;
  const newContent = await Content.create({
    courseId,
    title,
    description,
    contentData,
  });
  res.status(201).json(newContent);
});

// Update a content
exports.updateContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const { title, description, contentData } = req.body;
  const updatedContent = await Content.findByIdAndUpdate(
    contentId,
    { title, description, contentData },
    { new: true }
  );
  if (!updatedContent) {
    throw createError(404, "Content not found");
  }
  res.json(updatedContent);
});

// Delete a content
exports.deleteContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const deletedContent = await Content.findByIdAndDelete(contentId);
  if (!deletedContent) {
    throw createError(404, "Content not found");
  }
  res.json({ message: "Content deleted successfully" });
});
