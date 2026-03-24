import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["scenic", "peaceful", "food", "historic", "hidden"],
      required: true
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    images: [
      {
        url: {
        type: String,
        required: true
        },
        thumbnail: {
        type:String
        },
        publicId: {
        type: String
        }
      }
    ],

    story: {
      title: String,
      content: String,
      tips: [String],
      bestTimeToVisit: String
    },

    ratings: {
      uniqueness: { type: Number, default: 0 },
      vibe: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
      crowd: { type: Number, default: 0 },
      composite: { type: Number, default: 0 }
    },

    likesCount: {
      type: Number,
      default: 0
    },

    commentsCount: {
      type: Number,
      default: 0
    },

    trendingScore: {
      type: Number,
      default: 0
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    /*compositeScore: {
      type: Number,
      default: 0
    },*/

    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

//auto-calculate composite score
placeSchema.pre("save", function () {
  const r = this.ratings || {};

  this.compositeScore = 
    ((r.uniqueness || 0) + (r.vibe || 0) + (r.safety || 0) + (r.crowd || 0)) / 4;

});

// 🔥 Geospatial index (VERY IMPORTANT)
placeSchema.index({ location: "2dsphere" });

const Place = mongoose.model("Place", placeSchema);

export default Place;