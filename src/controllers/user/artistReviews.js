const ArtistReview = require("../../models/ArtistReview");
const Artist = require("../../models/Artists");
const mongoose = require("mongoose");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors/index");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res, next) => {
  const id = req.user.userId;

  if (!id) throw new BadRequestError("You must be authenticated");

  const { artistInfo, rating, review } = req.body;

  if (rating > 5) {
    throw new BadRequestError("Rating value cannot exceed 5");
  }

  const store = await Artist.findById(artistInfo);

  if (!store) {
    throw new NotFoundError("Artist was not found in database..");
  }

  const newReview = new ArtistReview({
    createdBy: id,
    artistInfo: artistInfo,
    rating: rating,
    review: review,
  });

  const doneReview = await newReview.save();

  res.status(StatusCodes.CREATED).json(doneReview); //201
};

module.exports = {
  createReview,
};
