const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const User = require("../models/UserModel");

// Get all users
exports.getUsers = asyncHandler(async (req, res) => {
  // Get the search query parameter
  const search = req.query.search || "";

  // Get the filtering criteria from query parameters
  const filters = {};
  if (req.query.role) {
    filters.role = req.query.role;
  }
  // Add more filters as needed

  // Construct the query object
  const query = {
    $and: [
      // Apply search on firstName and lastName fields
      {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
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
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const users = await User.find(query)
    .sort(sortCriteria)
    .skip(skip)
    .limit(pageSize)
    .select("firstName lastName email role enrolledCourses");

  // Get the total count of users
  const totalCount = await User.countDocuments();
  res.json({
    users,
    queryCount: users.length,
    page: pageNumber,
    limit: pageSize,
    totalCount,
  });
});

// Get a specific user
exports.getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found");
  }
  res.json(user);
});

// Update a user
exports.updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true }
  );
  if (!updatedUser) {
    throw createError(404, "User not found");
  }
  res.json(updatedUser);
});

// Delete a user
exports.deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const deletedUser = await User.deleteOne({ _id: userId });
  if (!deletedUser) {
    throw createError(404, "User not found");
  }
  res.json({ message: "User deleted successfully" });
});
