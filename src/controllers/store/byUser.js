const Store = require("../../models/Store");
const createError = require("http-errors");
const mongoose = require("mongoose");

const getStoreByUser = async (req, res, next) => {
  try {
    const store = await Store.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "artists",
          localField: "_id",
          foreignField: "storeDetails.id",
          as: "employees",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                profilePic: 1,
                languages: 1,
                experience: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "storereviews",
          localField: "_id",
          foreignField: "storeInfo",
          as: "reviews",
        },
      },
      {
        $project: {
          shopName: 1,
          email: 1,
          phone: 1,
          address: 1,
          landMark: 1,
          website: 1,
          isKidFriendly: 1,
          images: 1,
          distance: 1,
          categories: 1,
          gender: 1,
          location: 1,
          services: 1,
          locationInCity: 1,
          reviews: 1,
          employees: 1,
          featuredImage: 1,
        },
      },
    ]);
    // const store = await Store.findById(req.params.id, {
    //   shopName: 1,
    //   email: 1,
    //   phone: 1,
    //   address: 1,
    //   landMark: 1,
    //   website: 1,
    //   isKidFriendly: 1,
    //   images: 1,
    //   distance: 1,
    //   categories: 1,
    //   gender: 1,
    //   location: 1,
    //   services: 1,
    //   locationInCity: 1,
    // });

    if (!store) {
      throw createError(404, "Store does not exist");
    }

    const { password, ...info } = store[0];
    res.status(200).json(info);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      next(createError(400, "Invalid Store ID"));
      return;
    }
    next(err);
  }
};

const getAllByUser = async (req, res) => {
  const query = req.query.new;

  const stores = query
    ? await Store.find(
        {},
        {
          shopName: 1,
          email: 1,
          phone: 1,
          address: 1,
          landMark: 1,
          website: 1,
          isKidFriendly: 1,
          images: 1,
          distance: 1,
          categories: 1,
          gender: 1,
          location: 1,
          services: 1,
        }
      )
        .sort({ _id: -1 })
        .limit(20)
    : await Store.find(
        {},
        {
          shopName: 1,
          email: 1,
          phone: 1,
          address: 1,
          landMark: 1,
          website: 1,
          isKidFriendly: 1,
          images: 1,
          distance: 1,
          categories: 1,
          gender: 1,
          location: 1,
          services: 1,
        }
      );

  res.status(200).json(stores);
};

const getByLocation10Kms = async (req, res) => {
  const query = req.query.new;
  const stores = await Store.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [77.6999999953792, 10.729998299538786],
        },
        distanceField: "distance",
        maxDistance: 10000,
      },
    },
    {
      $project: {
        shopName: 1,
        email: 1,
        phone: 1,
        address: 1,
        landMark: 1,
        website: 1,
        isKidFriendly: 1,
        images: 1,
        distance: 1,
        categories: 1,
        gender: 1,
        location: 1,
        featuredImage: 1,
      },
    },
  ]);

  res.status(200).json(stores);
};

module.exports = {
  getAllByUser,
  getStoreByUser,
  getByLocation10Kms,
};
