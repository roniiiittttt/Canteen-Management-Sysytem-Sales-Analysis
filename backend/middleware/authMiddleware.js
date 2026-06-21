const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = decoded;

      next();
    } else {
      return res.status(401).json({
        message: "Not Authorized. No Token.",
      });
    }
  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(401).json({
      message: error.message,
    });
  }
};

// Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Admin Access Only",
    });
  }
};

module.exports = {
  protect,
  adminOnly,
};