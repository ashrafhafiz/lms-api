const jwt = require("jsonwebtoken");

// Capitalize the first letter of each word
exports.capitalize = (str) => {
  return str.replace(/\b\w+/g, function (s) {
    return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
  });
};

// Generate a JWT token
exports.generateToken = (userId) => {
  // Generate a token with the user ID as the payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
