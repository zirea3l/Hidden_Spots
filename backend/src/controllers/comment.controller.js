import Comment from "../models/Comment.js";
import Place from "../models/Place.js";

/* ================================
CREATE COMMENT
=================================*/
export const createComment =  async (req, res, next) => {
    try {
        const {content } = req.body;

        const place = await Place.findById(req.paramsId);

        if(!place) {
            return res.status(400).json ({
                message: "Place not found",
            });
        }

        const cooment = await Comment.create({
            content,
            place: req.params.placeId,
            user: req.user._id,
        });

        res.status(201).json(comment);

    }
    catch (error) {
        next(error);
    }
};



/*=====================================
GET COMMENTS FOR PLACE
=====================================*/

export const getPlaceComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({
            place: req.params.placeId,
        })
        .populate("user", "name")
        .sort({ createdAt: -1 });

        res.json(comments);
    }
    catch(error){
        next(error);
    }
};


/*==================================
DELETE COMMENT
==================================*/

export const deleteComment = async (req, res, next) => {
    try{
        const comment = await Comment.findById(req.params.commentId);

        if(!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        if(comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        await comment.deleteOne();
        res.json({
            message: "Comment deleted",
        });

    }
    catch(error){
        next(error);
    }
};