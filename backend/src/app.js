/*const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Backend is running 🚀" });
});

module.exports = app;*/

const express = require("express");
const cors = require("cors");

const app = express();

const { protect } = require("./middleware/auth.middleware");

/* =========================
Global Middlewares
========================= */
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/places", require("./routes/place.routes"));


/* =========================
Health Check Route
========================= */
app.get("/health", (req, res) => {
res.status(200).json({
    status: "OK",
    message: "Backend is running 🚀"
});
});

/* =========================
API Routes (to be added)
========================= */
// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/places", require("./routes/place.routes"));
// app.use("/api/admin", require("./routes/admin.routes"));

/* =========================
Global Error Handler
========================= */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
    });
});
app.use("/dev", require("./routes/dev.routes"));

app.get("/api/protected", protect, (req, res) => {
    res.json({
    message: "You are authorized",
    user: req.user
    });
});


module.exports = app;




