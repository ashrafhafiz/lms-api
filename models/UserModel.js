const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Course = require("./CourseModel");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "assistant", "instructor", "admin"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    // timestamps: { currentTime: () => new Date() },
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtual fields in JSON output
  }
);

// Virtual field for the full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual Field: registeredSince
userSchema.virtual("registeredSince").get(function () {
  const now = new Date();
  const registrationDate = this.registeredAt;
  const durationInMilliseconds = now - registrationDate;
  const durationInDays = Math.floor(
    durationInMilliseconds / (1000 * 60 * 60 * 24)
  );
  return durationInDays;
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Please refer to https://github.com/Automattic/mongoose/issues/9152
userSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const user = await this.model.findOne(this.getFilter());
    const userId = user._id;

    // Find and update related courses
    await Course.updateMany(
      {
        $or: [
          { students: userId },
          { instructors: userId },
          { assistants: userId },
        ],
      },
      { $pull: { students: userId, instructors: userId, assistants: userId } }
    );

    next();
  }
);

// Static method to validate password
userSchema.statics.validatePassword = async function (
  password,
  hashedPassword
) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw error;
  }
};

// Update the last login timestamp
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
