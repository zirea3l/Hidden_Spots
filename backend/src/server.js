import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import devRoutes from "./routes/dev.routes.js";
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// 🔴 BODY PARSERS (must be before routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/dev", devRoutes);

// health check
app.get("/health", (req, res) => {
    res.status(200).json({
    status: "OK",
    message: "Hidden Spots backend is healthy 🚀",
    });
});

// global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
    message: err.message || "Server Error",
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
});
