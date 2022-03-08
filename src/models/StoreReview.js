const mongoose = require("mongoose");

const StoreReviewSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    storeInfo: {
      type: mongoose.Types.ObjectId,
      ref: "Artist",
      required: [true, "Please provide a shop"],
    },
    serviceName: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },
    rateValue: {
      type: Number,
      default: 5,
    },
    review: {
      type: String,
      required: [true, "Review must be atleast 4 characters long"],
      minlength: [4, "Review must be atleast 4 characters long"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreReview", StoreReviewSchema);
