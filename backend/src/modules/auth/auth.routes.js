import e from "express";
import { registerUser, loginUser } from "./auth.controller.js";
import { authenticateToken } from "./auth.middleware.js";

const router = e.Router();

// Register route
router.post("/register", registerUser);
// Login route
router.post("/login", loginUser);

router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "This is a protected route, you are authenticated!, Welcome to your profile",
        user: req.user
    });
});

export default router;
