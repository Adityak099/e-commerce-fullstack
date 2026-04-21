import e from "express";
import { registerUser, loginUser, logoutUser } from "./auth.controller.js";
import { authenticateToken } from "./auth.middleware.js";

const router = e.Router();

// Register route
router.post("/register", registerUser);
// Login route
router.post("/login", loginUser);
// Logout route
router.post("/logout", authenticateToken, logoutUser);

// Route to get current user info (protected)
router.get("/me", authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

// Route to test protected access
router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "This is a protected route, you are authenticated!, Welcome to your profile",
        user: req.user
    });
});

export default router;
