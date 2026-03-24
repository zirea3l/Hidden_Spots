import express from "express";
import protect from "../middlewares/auth.middleware.js";

import {
    createComment,
    getPlaceComments,
    deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

/*===========================
COMMENTS FOR A PLACE
===========================*/

router.get("/:placeId", getPlaceComments);

router.post("/:placeId", protect, createComment);

router.delete("/:commentId", protect, deleteComment);

export default router;