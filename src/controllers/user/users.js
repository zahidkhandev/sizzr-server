const User = require("../../models/User");
const { StatusCodes } = require("http-status-codes");
const createError = require("http-errors");
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../../errors/index");

const getUser = async (req, res, next) => {
  if (req.user.userId === req.params.id) {
    try {
      const user = await User.findById(req.user.userId);

      if (!user) {
        throw new NotFoundError("User with this ID does not exist.");
      }

      const { password, ...info } = user._doc;
      res.status(200).json(info);
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        throw new BadRequestError("Username format invalid.");
      }
      next(err);
    }
  } else {
    throw new UnauthenticatedError("You can only view your profile.");
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.userId === req.params.id) {
    try {
      const result = await User.findByIdAndDelete(req.params.id);
      if (!result) {
        throw new NotFoundError("User does not exist");
      } else {
        res.status(StatusCodes.OK).json({ msg: "User has been deleted" });
      }
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        throw new BadRequestError("User ID invalid");
      }
      next(err);
    }
  } else {
    throw new UnauthenticatedError("You can only delete your account!");
  }
};

const patchUser = async (req, res, next) => {
  if (req.user.userId === req.params.id) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!updatedUser) {
        throw createError(404, "User does not exist");
      }

      const { password, ...info } = updatedUser._doc;

      res.status(200).json(info);
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError(400, "Invalid ID"));
        return;
      }
      next(err);
    }
  } else {
    throw new UnauthenticatedError("You can update only your account!");
  }
};

//TODO GET DEEPER IN THIS
const getAllUsers = async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(10)
      : await User.find();

    res.status(StatusCodes.OK).json(users);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const getUserStats = async (req, res) => {
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
      const data = await User.aggregate([
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

module.exports = {
  getAllUsers,
  getUserStats,
  getUser,
  deleteUser,
  patchUser,
};
