// Middleware to check if user has required role
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized — please login" });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Access denied — requires one of: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};
