const mongoose = require("mongoose");
const colors = require("colors");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");
const { data } = require("./data");
const { dbConnect } = require("../database/dbConnect");
const Enrollment = require("../models/EnrollmentModel");

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
    await Enrollment.deleteMany();

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

        // Enroll student in a course
        const enrollment = new Enrollment({
          user: user._id,
          course: courseId,
          role: "student",
          // Additional fields related to enrollment
        });

        // Save the enrollment
        await enrollment.save();
      }
    }

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

    // Iterate over the courses and assign them to assistants
    for (let course of courses) {
      // Calculate the workload for each assistant
      const assistantsWithWorkload = await Promise.all(
        assistants.map(async (assistant) => {
          const workload = await Enrollment.countDocuments({
            course: course._id,
            assistant: assistant._id,
          });

          return {
            assistant: assistant,
            workload: workload,
          };
        })
      );

      // Sort assistants based on workload (in ascending order)
      assistantsWithWorkload.sort((a, b) => a.workload - b.workload);
      // Assign the course to the assistant with the lowest workload
      const assignedAssistant = assistantsWithWorkload[0].assistant;

      // Assign the course to the assistant
      const enrollment = new Enrollment({
        user: assignedAssistant._id,
        course: course._id,
        role: "assistant",
        // Additional fields related to enrollment
      });

      // Save the enrollment
      await enrollment.save();
    }

    console.log("Courses distributed to assistants successfully");
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

    // Iterate over the courses and assign them to instructors
    for (let course of courses) {
      // Calculate the workload for each instructor
      const instructorsWithWorkload = await Promise.all(
        instructors.map(async (instructor) => {
          const workload = await Enrollment.countDocuments({
            course: course._id,
            instructor: instructor._id,
          });

          return {
            instructor: instructor,
            workload: workload,
          };
        })
      );

      // Sort instructors based on workload (in ascending order)
      instructorsWithWorkload.sort((a, b) => a.workload - b.workload);
      // Assign the course to the instructor with the lowest workload
      const assignedInstructor = instructorsWithWorkload[0].instructor;

      // Assign the course to the instructor
      const enrollment = new Enrollment({
        user: assignedInstructor._id,
        course: course._id,
        role: "instructor",
        // Additional fields related to enrollment
      });

      // Save the enrollment
      await enrollment.save();
    }

    console.log("Courses distributed to instructors successfully");
  } catch (error) {
    console.error("Error distributing courses:", error);
    process.exit(1); // Terminate the script with an error code
  }
};

seedDatabase();
