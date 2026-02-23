import express from "express";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, (req, res) => {
    res.json({
    message: "Admin dashboard",
    user: req.user,
    });
});

export default router;
