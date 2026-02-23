/*const express = require("express");
const mongoose = require("mongoose");
const Place = require("../models/Place");
const router = express.Router();

router.get("/test-place", async (req, res, next) => {
    
    try {
    const place = await Place.create({
    title: "Hidden Lake",
    description: "Peaceful spot surrounded by trees",
    category: "scenic",
    location: {
        type: "Point",
        coordinates: [78.1828, 26.2183]
    },
    createdBy: new mongoose.Types.ObjectId()
    });

    res.json(place);
    } catch (err) {
    next(err);
    }
});

module.exports = router;*/

import express from "express";

const router = express.Router();

/**
 * @route   GET /dev
 * @desc    Dev root check
 */
router.get("/", (req, res) => {
res.status(200).json({
    success: true,
    message: "Dev routes are working ✅",
});
});

/**
 * @route   GET /dev/test-place
 * @desc    Test place endpoint
 */
router.get("/test-place", (req, res) => {
res.status(200).json({
    success: true,
    message: "Test place route is working 🚀",
    data: {
    name: "Sunset Point",
    vibe: "Peaceful",
    category: "Hidden Spot",
    location: {
        city: "Gwalior",
        coordinates: [78.1828, 26.2183],
    },
    },
});
});

/**
 * @route   GET /dev/health
 * @desc    Backend health check
 */
router.get("/health", (req, res) => {
res.status(200).json({
    status: "OK",
    service: "Hidden Spots Backend",
    uptime: process.uptime(),
    timestamp: new Date(),
});
});

export default router;
