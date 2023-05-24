const mongoose = require("mongoose");
const colors = require("colors");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");
const { dbConnect } = require("../database/dbConnect");

// console.log(dbConfig.DB_URL);

dbConnect();
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB Server".brightCyan);
});

mongoose.connection.on("error", (error) => {
  console.log(colors.brightRed(error));
});

const getCoursesWithNoStudents = async () => {
  try {
    // Query courses with no students enrolled
    const courses = await Course.find({ students: { $size: 0 } }).select(
      "title description"
    );

    console.log("Courses with no students enrolled:", courses);
    process.exit(); // Terminate the script
  } catch (error) {
    console.error("Error querying courses:", error);
    process.exit(1); // Terminate the script with an error code
  }
};

getCoursesWithNoStudents();
