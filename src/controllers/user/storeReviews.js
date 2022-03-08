const StoreReview = require("../../models/StoreReview");
const Store = require("../../models/Store");
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

  const { storeInfo, rating, review } = req.body;

  if (rating > 5) {
    throw new BadRequestError("Rating value cannot exceed 5");
  }

  const store = await Store.findById(storeInfo);

  if (!store) {
    throw new NotFoundError("Store was not found in database..");
  }

  const newReview = new StoreReview({
    createdBy: id,
    storeInfo: storeInfo,
    rating: rating,
    review: review,
  });

  const doneReview = await newReview.save();

  res.status(StatusCodes.CREATED).json(doneReview); //201
};

module.exports = {
  createReview,
};
