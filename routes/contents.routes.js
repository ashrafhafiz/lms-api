const express = require("express");
const router = express.Router();
const ContentController = require("../controllers/ContentController");

// GET /courses/:courseId/contents
router.get(
  "/courses/:courseId/contents",
  ContentController.getContentsByCourse
);

// GET /contents/:contentId
router.get("/contents/:contentId", ContentController.getContent);

// POST /contents
router.post("/contents", ContentController.createContent);

// PUT /contents/:contentId
router.put("/contents/:contentId", ContentController.updateContent);

// DELETE /contents/:contentId
router.delete("/contents/:contentId", ContentController.deleteContent);

module.exports = router;
