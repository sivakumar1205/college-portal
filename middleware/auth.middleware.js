
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    if (
      !decoded.id ||
      !["Student", "Teacher"].includes(decoded.role)
    ) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const permissionMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: "You do not have permission to access this resource",
    });
  }

  next();
};

module.exports = authMiddleware;
module.exports.permissionMiddleware = permissionMiddleware;
