const Store = require("../../models/Store");
const createError = require("http-errors");
const mongoose = require("mongoose");
const cloudinary = require("../../utils/cloudinary/cloudinary");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors/index");

const getStore = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    throw new BadRequestError("Please provide store ID");
  }
  if (
    req.user.storeId === id ||
    req.user.isAdmin === true ||
    req.user.isMod === true
  ) {
    const store = await Store.findById(id, { password: 0 });

    if (!store) {
      throw new NotFoundError("Store does not exist");
    }

    const { password, ...info } = store._doc;
    res.status(200).json(info);
  } else {
    throw new UnauthenticatedError(
      "You are not allowed to perform this action"
    );
  }
};

const getAll = async (req, res) => {
  const query = req.query.new;
  // if (req.user.isAdmin) {
  try {
    const users = query
      ? await Store.find().sort({ _id: -1 }).limit(10)
      : await Store.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getStoreStats = async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);
  const monthsArray = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (req.user.isMod) {
    try {
      const data = await Store.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to perform this action");
  }
};

const deleteStore = async (req, res, next) => {
  if (req.user.storeId === req.params.id) {
    try {
      const result = await Store.findByIdAndDelete(req.params.id);
      if (!result) {
        throw createError(404, "User does not exist");
      } else {
        res.status(200).json("User has been deleted");
      }
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError(400, "Invalid User ID"));
        return;
      }
      next(err);
    }
  } else {
    res.status(403).json("You can only delete your account!");
  }
};

const patchStore = async (req, res, next) => {
  if (req.user.storeId === req.params.id) {
    const updatedUser = await Store.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("Shop does not exist");
    }

    const { password, ...info } = updatedUser;
    res.status(200).json({ msg: "Shop updated sucessfully" });
  } else {
    throw new UnauthenticatedError("You can update only your account!");
  }
};

const uploadImage = async (req, res, next) => {
  if (req.user.storeId === req.params.id) {
    const { desc, data } = req.body;

    const result = await cloudinary.uploader.upload(data, {
      folder: `store/${req.params.id}`,
    });

    if (result) {
      const { secure_url, public_id } = result;
      const updatedUser = await Store.findByIdAndUpdate(req.params.id, {
        $push: {
          images: {
            secure_url: secure_url,
            public_id: public_id,
            desc: desc,
          },
        },
      });

      if (updatedUser) res.json({ msg: "Image uploaded successfully!" });
      else {
        throw new NotFoundError("Image upload failed");
      }
    } else {
      throw new BadRequestError("Image upload failed");
    }
  } else {
    throw new UnauthenticatedError("You are unauthenticated!");
  }
};

const getImages = async (req, res, next) => {
  if (req.user.storeId === req.params.id) {
    const fetchImages = await Store.findById(req.user.storeId, {
      images: 1,
      featuredImage: 1,
    });
    res.json(fetchImages);
  } else {
    throw new UnauthenticatedError("You are unauthenticated!");
  }
};

const deleteImage = async (req, res, next) => {
  if (req.user.storeId === req.params.id) {
    //Image id for mongodb, public id for cloudinary
    const { imgId, public_id } = req.body;
    if (!imgId) {
      throw new BadRequestError("Please provide Image ID");
    }
    const deleteImage = await Store.findByIdAndUpdate(req.user.storeId, {
      $pull: {
        images: {
          _id: mongoose.Types.ObjectId(imgId),
        },
      },
    });
    const cloudDelete = await cloudinary.uploader.destroy(public_id);

    if (cloudDelete.result === "not found")
      throw new NotFoundError("Image does not exist or is already deleted");

    if (deleteImage && cloudDelete)
      res.json({ msg: "Image deleted successfully!" });
    else throw new NotFoundError("Image delete failed");
  } else {
    throw new UnauthenticatedError("You are unauthenticated!");
  }
};

module.exports = {
  getStore,
  getAll,
  getStoreStats,
  deleteStore,
  patchStore,
  uploadImage,
  getImages,
  deleteImage,
};
