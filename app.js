const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const createError = require("http-errors");

// const fileUpload = require("express-fileupload");

const { readdirSync } = require("fs");
// const path = require("path");
// console.log(__dirname);
// console.log(path.resolve(__dirname));

const allowedOrigins = [
  "https://localhost:3000",
  "https://example1.com",
  "https://example2.com",
];

const corsOptions = {
  origin: allowedOrigins,
  useSuccessStatus: 200,
  // methods: ["GET", "POST"],
  // allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Note that if you're allowing multiple origins, you should also configure your server
// to set the Access-Control-Allow-Origin header to the origin of the incoming request.
// This can be done using the Access-Control-Allow-Origin middleware in Express.js,
// like this:
// app.use(function (req, res, next) {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
// This middleware checks the origin of the incoming request against the allowedOrigins
// array, and sets the Access-Control-Allow-Origin header if it's included.
// It also sets the Access-Control-Allow-Methods and Access-Control-Allow-Headers
// headers to allow the specified HTTP methods and headers.

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(fileUpload());

// const {
//   authRoutes,
//   userRoutes,
//   assessmentRoutes,
//   contentRoutes,
//   courseRoutes,
// } = require("./playground");
// app.use("/api/v1", [
//   authRoutes,
//   userRoutes,
//   assessmentRoutes,
//   contentRoutes,
//   courseRoutes,
// ]);
// console.log(readdirSync(__dirname + "/routes/"));
readdirSync(__dirname + "/routes/").map((f) =>
  app.use("/api/v1", require("./routes/" + f))
);

// Handling 404 errors
app.use((req, res, next) => {
  next(createError(404));
});

// Error handling
app.use((error, req, res, next) => {
  console.log("Error status: ", error.status);
  console.log("Message: ", error.message);
  console.log("Message: ", error.stack);

  res.status(error.status || 500);
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
});

module.exports = app;
