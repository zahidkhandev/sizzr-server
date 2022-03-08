const mongoose = require("mongoose");

const ArtistReviewSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    artistInfo: {
      type: mongoose.Types.ObjectId,
      ref: "Artist",
      required: [true, "Please provide a shop"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    serviceName: {
      type: String,
    },
    rateValue: {
      type: Number,
      default: 5,
    },
    review: {
      type: String,
      required: [true, "Review must be atleast 4 characters long"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ArtistReview", ArtistReviewSchema);
