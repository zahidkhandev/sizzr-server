const Store = require("../../models/Store");
const Artist = require("../../models/Artists");
const createError = require("http-errors");
const mongoose = require("mongoose");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors/index");
const jwt = require("jsonwebtoken");

const getStoreEmployees = async (req, res, next) => {
  const id = req.params.id;

  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }
  if (req.user.storeId === id) {
    const emp = await Store.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "artists",
          localField: "_id",
          foreignField: "storeDetails.id",
          as: "employees",
        },
      },
      {
        $project: {
          "employees._id": 1,
          "employees.email": 1,
          "employees.storeDetails": 1,
          "employees.profilePic": 1,
          "employees.firstName": 1,
          "employees.lastName": 1,
          "employees.phone": 1,
          "employees.address": 1,
          _id: 0,
        },
      },
    ]);

    res.json([...emp[0].employees]);
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

const verifyEmployee = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (!req.body.employee) {
    throw new BadRequestError("Please provide employee ID");
  }

  const emp = await Artist.findById(req.body.employee, { storeDetails: 1 });

  if (!emp.storeDetails.id) {
    throw new UnauthenticatedError(
      `This employee never requested to join your team`
    );
  }

  if (emp.storeDetails.id.toString() === id || emp.storeDetails.id === id) {
    if (req.user.storeId === id) {
      const acceptEmp = await Artist.findByIdAndUpdate(
        req.body.employee,
        {
          $set: {
            "storeDetails.verified": true,
          },
        },
        {
          new: true,
        }
      );

      res.json({
        status: 200,
        msg: "Employee has been verfied, now they are part of your team",
      });
    } else {
      throw new UnauthenticatedError(
        `You are not authenticated to this store, please try again ${req.user.storeId}`
      );
    }
  } else {
    throw new UnauthenticatedError(
      `This employee never requested to join your team`
    );
  }
};

const removeEmployee = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (!req.body.employee) {
    throw new BadRequestError("Please provide employee ID");
  }

  const emp = await Artist.findById(req.body.employee, {
    storeDetails: 1,
    _id: 0,
  });

  if (!emp.storeDetails.id) {
    throw new UnauthenticatedError(`This employee was never part of your team`);
  }

  if (emp.storeDetails.id.toString() === id || emp.storeDetails.id === id) {
    if (req.user.storeId === id) {
      const delEmp = await Artist.findOneAndUpdate(
        req.body.employee,
        { $unset: { storeDetails: 1 } },
        {
          new: true,
        }
      );

      res.json({
        status: 200,
        msg: "Employee has been removed from your team",
      });
    } else {
      throw new UnauthenticatedError(
        `You are not authenticated to this store, please try again ${req.user.storeId}`
      );
    }
  } else {
    throw new UnauthenticatedError(`This employee was never part of your team`);
  }
};

const generateArtistLink = async (req, res, next) => {
  const id = req.params.id;

  if (!req.params.id) {
    throw new BadRequestError("Please provide store ID");
  }

  if (req.user.storeId === id) {
    const accessToken = jwt.sign({ storeId: id }, process.env.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
    //TODO CHANGE FROM LOCAL TO PROD URL
    const link = `localhost:3004/dashboard/store/join/${id}?n=${accessToken}`;
    res.json({
      link: link,
    });
  } else {
    throw new UnauthenticatedError(
      `You are not authenticated to this store, please try again ${req.user.storeId}`
    );
  }
};

module.exports = {
  generateArtistLink,
  getStoreEmployees,
  verifyEmployee,
  removeEmployee,
};
