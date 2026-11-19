import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, (req, res) => {
    res.json({
        user: req.user
    });
});

router.get("/test", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated!",
        user: req.user
    });
});

router.post("/logout", authMiddleware, logoutUser);

export default router;  