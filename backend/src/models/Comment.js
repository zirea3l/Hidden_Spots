import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required:true,
            trim: true,
        },

        place: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Place",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;