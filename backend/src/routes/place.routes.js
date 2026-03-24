/*
import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
    createPlace,
    getAllPlaces,
    getNearbyPlaces,
    getTopPlaces,
} from "../controllers/place.controller.js";
import upload from "../middlewares/upload.middleware.js";
import {
    uploadPlaceImages
} from "../controllers/place.controller.js";


const router = express.Router();

router.post(
    "/:id/images",
    protect,
    upload.array("images", 5),
    uploadPlaceImages
);*/

// public route
/*router.get("/", (req, res) => {
    res.json({ message: "Public places list" });
});
router.get("/", getAllPlaces);
router.get("/nearby", getNearbyPlaces);
router.get("/top", getTopPlaces);


// protected route
/*router.post("/", protect, (req, res) => {
    res.json({
    message: "Place created successfully",
    user: req.user,
    });
});
router.post("/", protect, createPlace);


export default router;*/

import express from "express";
import protect from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import {
    createPlace,
    getAllPlaces,
    getNearbyPlaces,
    getTopPlaces,
    getTrendingPlaces,
    uploadPlaceImages,
    deletePlaceImage,
    getPlaceById,
    updatePlace,
    deletePlace,
    getTrendingPlaces,
    getPersonalizedFeed
} from "../controllers/place.controller.js";

const router = express.Router();

/* ======================
PUBLIC ROUTES
====================== */

router.get("/nearby", getNearbyPlaces);
router.get("/top", getTopPlaces);
router.get("/trending", getTrendingPlaces);
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);
router.get("/feed",protect,getPersonalizedFeed);
router.put("/:id", protect, updatePlace);
router.delete("/:id", protect, deletePlace);

/* ======================
PROTECTED ROUTES
====================== */

router.post("/", protect, createPlace);

router.post(
    "/:id/images",
    protect,
    upload.array("images", 5),
    uploadPlaceImages
);

export default router;