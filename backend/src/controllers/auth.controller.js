import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* =========================
Generate JWT
========================= */
const generateToken = (userId) => {
return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);
};

/* =========================
Register
========================= */
export const register = async (req, res, next) => {
try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
    },
    token,
    });
} catch (err) {
    next(err);
}
};

/* =========================
Login
========================= */
export const login = async (req, res, next) => {
try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
    },
    token,
    });
} catch (err) {
    next(err);
}
};

