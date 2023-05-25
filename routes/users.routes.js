const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// GET /users
router.get("/users", UserController.getUsers);

// GET /users/:userId
router.get("/users/:userId", UserController.getUser);

// PUT /users/:userId
router.put("/users/:userId", UserController.updateUser);

// DELETE /users/:userId
router.delete("/users/:userId", UserController.deleteUser);

module.exports = router;
