const Store = require("../../models/Store");
const Artist = require("../../models/Artists");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors/index");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const getStoreByArtist = async (req, res, next) => {
  const store = await Store.findById(req.params.id, {
    shopName: 1,
    email: 1,
    phone: 1,
    address: 1,
    website: 1,
    images: 1,
    location: 1,
  });

  if (!store) {
    throw new NotFoundError("Store does not exist");
  }

  const { password, ...info } = store._doc;

  res.status(200).json(info);
};

const joinStore = async (req, res, next) => {
  const id = req.params.id;

  const storeId = req.body.storeId;

  const expiryToken = req.body.expiryToken;

  if (!id) {
    throw new BadRequestError("Please provide artist ID");
  }
  if (!storeId) {
    throw new BadRequestError("Please provide store ID");
  }

  var tokenIsFine = true;

  jwt.verify(expiryToken, process.env.SECRET_KEY, async (err) => {
    if (err) {
      tokenIsFine = false;
    }
  });

  if (tokenIsFine === true) {
    if (req.user.artistId === id) {
      const updateArtist = await Artist.findOneAndUpdate(
        { _id: id, "storeDetails.id": { $exists: false } },
        {
          $set: { storeDetails: { id: storeId, verified: false } },
        },
        { new: true }
      );

      if (updateArtist === null) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ msg: "You must leave your old store to join a new one" });
        return;
      } else {
        res.status(200).json(updateArtist);
      }
    } else {
      throw new UnauthenticatedError(
        `You are not authenticated to this account, please try again ${req.user.artistId}`
      );
    }
  } else {
    throw new BadRequestError(
      "Link expired or is not valid, request the store owner to generate a new link"
    );
  }
};

module.exports = {
  getStoreByArtist,
  joinStore,
};
