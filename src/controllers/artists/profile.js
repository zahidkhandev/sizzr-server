const Artist = require("../../models/Artists");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors/index");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const editArtistProfile = async (req, res, next) => {
  const id = req.params.id;

  if (id === req.user.artistId) {
    const updatedUser = await Artist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("User does not exist");
    }

    res.status(StatusCodes.OK).json({ ...updatedUser._doc });
  } else {
    throw new UnauthenticatedError("You are not authorized for this action!");
  }
};

module.exports = {
  editArtistProfile,
};
