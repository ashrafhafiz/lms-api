const mongoose = require("mongoose");
const colors = require("colors");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");
const { data } = require("./data");
const { dbConnect } = require("../database/dbConnect");

// console.log(dbConfig.DB_URL);

dbConnect();
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB Server".brightCyan);
});

mongoose.connection.on("error", (error) => {
  console.log(colors.brightRed(error));
});

const seedDatabase = async () => {
  try {
    // Clear existing data (optional)
    await User.deleteMany();
    await Course.deleteMany();

    // Create and save new user instances
    const { users, courses } = data;
    for (let user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
    const createdUsers = await User.insertMany(users);
    const createdCourses = await Course.insertMany(courses);

    // Other seeding logic for other models, if applicable
    for (let user of createdUsers) {
      if (user.role === "student") {
        const randomCourseIndex = Math.floor(
          Math.random() * createdCourses.length
        );
        const courseId = createdCourses[randomCourseIndex]._id;
        user.enrolledCourses.push(courseId);

        const course = await Course.findById(courseId);
        course.students.push(user._id);
        await course.save();
      }
    }

    // Save the updated users
    await Promise.all(createdUsers.map((user) => user.save()));

    // Distribute Courses To Assistants
    await distributeCoursesToAssistants();

    // Distribute Courses To Instructors
    await distributeCoursesToInstructors();

    console.log("Database seeded successfully");
    process.exit(); // Terminate the script after seeding
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // Terminate the script with an error code
  }
};

const distributeCoursesToAssistants = async () => {
  try {
    // Retrieve all available assistants
    const assistants = await User.find({ role: "assistant" });

    // Retrieve all available courses
    const courses = await Course.find();

    // Sort assistants based on workload (number of assigned courses)
    assistants.sort(
      (a, b) => a.enrolledCourses.length - b.enrolledCourses.length
    );

    // Iterate over the courses and assign them to assistants
    for (let course of courses) {
      const assistant = assistants.shift(); // Get the assistant with the least workload

      // Assign the course to the assistant
      assistant.enrolledCourses.push(course._id);

      // Update the assistant's workload
      assistants.push(assistant);
      assistants.sort(
        (a, b) => a.enrolledCourses.length - b.enrolledCourses.length
      );

      // Update the course
      course.assistants.push(assistant._id);
    }

    // Save the updated assistants in the database
    await Promise.all(assistants.map((assistant) => assistant.save()));
    await Promise.all(courses.map((course) => course.save()));

    console.log("Courses distributed to assistants successfully");
    // process.exit(); // Terminate the script
  } catch (error) {
    console.error("Error distributing courses:", error);
    process.exit(1); // Terminate the script with an error code
  }
};

const distributeCoursesToInstructors = async () => {
  try {
    // Retrieve all available instructors
    const instructors = await User.find({ role: "instructor" });

    // Retrieve all available courses
    const courses = await Course.find();

    // Sort instructors based on workload (number of assigned courses)
    instructors.sort(
      (a, b) => a.enrolledCourses.length - b.enrolledCourses.length
    );

    // Iterate over the courses and assign them to instructors
    for (let course of courses) {
      const instructor = instructors.shift(); // Get the instructor with the least workload

      // Assign the course to the instructor
      instructor.enrolledCourses.push(course._id);

      // Update the instructor's workload
      instructors.push(instructor);
      instructors.sort(
        (a, b) => a.enrolledCourses.length - b.enrolledCourses.length
      );

      // Update the course
      course.instructors.push(instructor._id);
    }

    // Save the updated instructors in the database
    await Promise.all(instructors.map((instructor) => instructor.save()));
    await Promise.all(courses.map((course) => course.save()));

    console.log("Courses distributed to instructors successfully");
    // process.exit(); // Terminate the script
  } catch (error) {
    console.error("Error distributing courses:", error);
    process.exit(1); // Terminate the script with an error code
  }
};

seedDatabase();
