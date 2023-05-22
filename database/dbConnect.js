// external imports
require("dotenv/config");
const mongoose = require("mongoose");

exports.dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    console.error(error);
  }
};
