const jwt = require("jsonwebtoken");

// Middleware to authenticate and authorize the user
exports.authenticate = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, "your-secret-key");
    req.user = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
