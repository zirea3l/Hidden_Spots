import multer from "multer";
//import { CloundinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage ({
    cloudinary,
    params:{
        folder: "hidden-spots",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{width: 1200, crop: "limit"}]
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024},

});

export default upload;