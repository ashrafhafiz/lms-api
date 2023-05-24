// external imports
const { dbConfig } = require("../config/dbConfig");
const mongoose = require("mongoose");

exports.dbConnect = async () => {
  try {
    await mongoose.connect(dbConfig.DB_URL);
  } catch (error) {
    console.error(error);
  }
};
