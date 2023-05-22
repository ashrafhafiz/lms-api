const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// POST /auth/register
router.post("/auth/register", AuthController.register);

// POST /auth/login
router.post("/auth/login", AuthController.login);

module.exports = router;
