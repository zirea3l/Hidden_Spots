/*import Place from "../models/place.js";

// CREATE PLACE (protected)
export const createPlace = async (req, res) => {
    try {
    const { name, description, latitude, longitude, ratings } = req.body;

    if (!latitude || !longitude) {
    return res.status(400).json({ message: "Location required" });
    }

    const place = await Place.create({
    name,
    description,
    location: {
        type: "Point",
        coordinates: [longitude, latitude], // IMPORTANT ORDER
    },
    ratings,
    createdBy: req.user._id,
    });

    res.status(201).json(place);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

// GET ALL PLACES (public)
export const getAllPlaces = async (req, res) => {
    const places = await Place.find().limit(20);
    res.json(places);
};

// GET NEARBY PLACES (public)
export const getNearbyPlaces = async (req, res) => {
    const { lat, lng, distance = 5 } = req.query;

    const places = await Place.find({
    location: {
        $near: {
        $geometry: {
            type: "Point",
            coordinates: [lng, lat],
        },
        $maxDistance: distance * 1000, // km → meters
        },
    },
    });

    res.json(places);
};
*/


/*import Place from "../models/Place.js";
import { calculateCompositeScore } from "../utils/rating.utils.js";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";

// CREATE PLACE (protected)
export const createPlace = async (req, res, next) => {
    try {
    const { title, description, category, location } = req.body;

    if (!location || !location.coordinates) {
    return res.status(400).json({ message: "Location required" });
    }

    let compositeScore = 0;
    if (ratings) {
        compositeScore = calculateCompositeScore(ratings);
    }

    const place = await Place.create({
    title,
    description,
    category,
    location,
    createdBy: req.user._id,
    });

    res.status(201).json(place);
    } catch (error) {
    next(error);
    } 
};

// GET ALL PLACES (public)
export const getAllPlaces = async (req, res, next) => {
    try {
    const places = await Place.find().limit(20);
    res.json(places);
    } catch (error) {
    next(error);
    }
};

// GET NEARBY PLACES (public)
export const getNearbyPlaces = async (req, res, next) => {
    try {
    const { lat, lng, distance = 5 } = req.query;

    if(!lat || !lng){
        return res.status(400).json({
            message: "lat and lng required"
        });
    }

    const places = await Place.find({
    location: {
        $near: {
        $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
        },
          $maxDistance: distance * 1000,
        },
    },
    });

    res.json(places);
    } catch (error) {
    next(error);
    }
};

//Top places
export const getTopPlaces = async (req, res, next) => {
    try {
        const places = await Place.find()
            .sort({ compositeScore: -1})
            .limit(10);

        res.json(places);
    } catch(error) {
        next(error);
    }
};

export const uploadPlaceImages = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id);

        if(!place) {
            return res.status(404).json({
                message: "Place not found"
            });
        }

        const uploadedImages = [];

        for (const file of req.files) {
            //compress image
            const buffer = await sharp(file.buffer)
                .resize(1280)
                .jpeg({ quality: 80 })
                .toBuffer();

            //upload to cloudinary
            const result = await cloudinary.uploader.upload(
                `data:image/jpeg;base64,${buffer.toString("base64")}`,
                { folder: "places"}
            );

            uploadedImages.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        }

        place.images.push(...uploadedImages);
        await place.save();

        res.json(place);
    } catch(error) {
        next(error);
    }
};*/

import Place from "../models/Place.js";
import { calculateCompositeScore } from "../utils/rating.utils.js";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
/* ==============================
CREATE PLACE
============================== */
export const createPlace = async (req, res, next) => {
    try {
    const { title, description, category, location, ratings } = req.body;

    if (!location || !location.coordinates) {
    return res.status(400).json({ 
        message: "Location required" });
    }

    let compositeScore = 0;

    if (ratings) {
    compositeScore = calculateCompositeScore(ratings);
    }

    const place = await Place.create({
    title,
    description,
    category,
    location,
    ratings,
    compositeScore,
    createdBy: req.user._id,
    });

    res.status(201).json(place);
    } catch (error) {
    next(error);
    }
};


/* ==============================
GET ALL PLACES
============================== */
export const getAllPlaces = async (req, res, next) => {
    try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const places = await Place.find()
    .populate("createdBy", "name")
    .skip(skip)
    .limit(limit);

    res.json({
    page,
    results: places.length,
    places,
    });
    } catch (error) {
    next(error);
    }
};

/* ==============================
GET SINGLE PLACE
============================== */
export const getPlaceById = async (req, res, next) => {
    try {
    const place = await Place.findById(req.params.id)
    .populate("createdBy", "name email");

    if (!place) {
    return res.status(404).json({
        message: "Place not found",
    });
    }

    res.json(place);
    } catch (error) {
    next(error);
    }
};


/* ==============================
GET NEARBY PLACES
============================== */
export const getNearbyPlaces = async (req, res, next) => {
    try {
    const { lat, lng, distance = 5 } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({
        message: "lat and lng required",
    });
    }

    const places = await Place.find({
        location: {
        $near: {
        $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
        },
          $maxDistance: distance * 1000,
        },
        },
    });

    res.json(places);
    } catch (error) {
    next(error);
    }
};


/* ==============================
GET TOP PLACES
============================== */
export const getTopPlaces = async (req, res, next) => {
    try {
    const places = await Place.find()
    .sort({ compositeScore: -1 })
    .limit(10)
    .populate("createdBy", "name");

    res.json(places);
    } catch (error) {
    next(error);
    }
};

/*===============================
GET TRENDING PLACES
===============================*/
export const getTrendingPlaces = async (req, res, next) => {
    try {
    const places = await Place.find()
    .sort({ trendingScore: -1 })
    .limit(10)
    .populate("createdBy", "name");

    res.json(places);

    } catch (error) {
    next(error);
    }
};

/* ==============================
UPDATE PLACE
============================== */
export const updatePlace = async (req, res, next) => {
    try {
    const place = await Place.findById(req.params.id);

    if (!place) {
    return res.status(404).json({
        message: "Place not found",
    });
    }

    // ownership check
    if (place.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
        message: "Not authorized",
    });
    }

    const { title, description, category, story } = req.body;

    if (title) place.title = title;
    if (description) place.description = description;
    if (category) place.category = category;
    if (story) place.story = story;

    await place.save();

    res.json({
    message: "Place updated successfully",
    place,
    });
    } catch (error) {
    next(error);
    }
};

/*===============================
PERSONALIZED FEED
===============================*/
export const getPersonalizedFeed = async (req, res, next) => {
    try {
    const user = req.user;

    const userData = await User.findById(user._id);

    const userCategories = userData.preferences?.categories || [];

    const { lat, lng } = req.query;

    const latNum = Number(lat);
    const lngNum = Number(lng);

    let places = await Place.find();

    // scoring
    places = places.map((place) => {
    let score = place.trendingScore;

      // category boost
    if (userCategories.includes(place.category)) {
        score += 10;
    }

      // distance boost
    if (latNum && lngNum) {
        const distance = Math.sqrt(
        Math.pow(place.location.coordinates[1] - latNum, 2) +
        Math.pow(place.location.coordinates[0] - lngNum, 2)
        );

        score += Math.max(0, 5 - distance);
    }

    return {
        ...place.toObject(),
        personalizedScore: score,
    };
    });

    // sort
    places.sort((a, b) => b.personalizedScore - a.personalizedScore);

    res.json(places.slice(0, 10));

    } catch (error) {
    next(error);
    }
};

/*===============================
TOGGLE PLACE
===============================*/
export const toggleLikePlace = async (req, res, next) => {
    try {
    const place = await Place.findById(req.params.id);

    if (!place) {
    return res.status(404).json({
        message: "Place not found",
    });
    }

    const userId = req.user._id;

    const alreadyLiked = place.likes.includes(userId);

    if (alreadyLiked) {
      // ❌ UNLIKE
    place.likes = place.likes.filter(
        (id) => id.toString() !== userId.toString()
    );
    place.likesCount = Math.max(0, place.likesCount - 1);

    } else {
      // ✅ LIKE
    place.likes.push(userId);
    place.likesCount += 1;

      // ⭐ ADD THIS PART HERE
    const user = await User.findById(userId);

    if (!user.preferences.categories.includes(place.category)) {
        user.preferences.categories.push(place.category);
        await user.save();
    }
    }

    // 🔥 recalculate trending
    place.trendingScore = calculateTrendingScore(place);

    await place.save();

    res.json({
    message: alreadyLiked ? "Unliked" : "Liked",
    likesCount: place.likesCount,
    });

    } catch (error) {
    next(error);
    }
};

/* ==============================
DELETE PLACE
============================== */
export const deletePlace = async (req, res, next) => {
    try {
    const place = await Place.findById(req.params.id);

    if (!place) {
    return res.status(404).json({
        message: "Place not found",
    });
    }

    // ownership check
    if (place.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
        message: "Not authorized",
    });
    }

    // delete all images from cloudinary
    for (const image of place.images) {
    await cloudinary.uploader.destroy(image.public_id);
    }

    await place.deleteOne();

    res.json({
    message: "Place deleted successfully",
    });
    } catch (error) {
    next(error);
    }
};

/* ==============================
UPLOAD PLACE IMAGES
============================== */
export const uploadPlaceImages = async (req, res, next) => {
    try {

    const place = await Place.findById(req.params.id);

    if (!place) {
    return res.status(404).json({
        message: "Place not found",
    });
    }

    // Only owner can upload
    if (place.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
        message: "Not authorized",
    });
    }

    if (!req.files || req.files.length === 0) {
    return res.status(400).json({
        message: "No images uploaded",
    });
    }

    const uploadedImages = [];

    for (const file of req.files) {

      // compress image
    const buffer = await sharp(file.buffer)
        .resize(1280)
        .jpeg({ quality: 80 })
        .toBuffer();

      // upload to cloudinary
    const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString("base64")}`,
        { folder: "places" }
    );

        uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
    });

    }

    place.images.push(...uploadedImages);
    await place.save();

    res.json({
    message: "Images uploaded successfully",
    images: uploadedImages,
    });

    } catch (error) {
    next(error);
    }
};


/* ==============================
DELETE PLACE IMAGE
============================== */
export const deletePlaceImage = async (req, res, next) => {
    try {

    const { id, imageId } = req.params;

    const place = await Place.findById(id);

    if (!place) {
    return res.status(404).json({
        message: "Place not found",
    });
    }

    // Only owner can delete
    if (place.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
        message: "Not authorized",
    });
    }

    const image = place.images.find(
    (img) => img.public_id === imageId
    );

    if (!image) {
    return res.status(404).json({
        message: "Image not found",
    });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // remove from database
    place.images = place.images.filter(
    (img) => img.public_id !== imageId
    );

    await place.save();

    res.json({
    message: "Image deleted successfully",
    });

    } catch (error) {
    next(error);
    }
};