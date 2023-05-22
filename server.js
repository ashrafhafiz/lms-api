const http = require("http");
const app = require("./app");
var colors = require("colors");
const { dbConnect } = require("./database/dbConnect");
// const cloudinary = require("cloudinary");

// Handle application uncaughtException errors
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Error Stack: ${err.stack}`);
  console.log("Shutting down the server due to Uncaught Exception...");
  process.exit(1);
});

// Setting up .env config file
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config/.env" });
const PORT = process.env.PORT || 8000;
const MODE = process.env.NODE_ENV;

// Connect to MongoDB
dbConnect();

// Setting up Cloudinary configuration
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB Server".brightCyan);

  server.listen(PORT, function () {
    console.log(
      `Express Server started on PORT:${PORT} in ${MODE} mode.`.brightCyan
    );
  });
});

mongoose.connection.on("error", (error) => {
  console.log(colors.brightRed(error));
  logEvents(
    `${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
    "mongoDBErrorLog.log"
  );
});

// Handle application unhandledRejection errors
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection...");
  server.close(() => process.exit(1));
});
