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


import Place from "../models/place.js";
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
                `data:image/jpeg;based64,${buffer.toString("base64")}`,
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
};