const Appointment = require("../../models/Appointment");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../../errors/index");
const Store = require("../../models/Store");
const mongoose = require("mongoose");

const createAppointment = async (req, res, next) => {
  req.body.createdBy = req.user.userId;

  const { storeInfo, startTime, endTime } = req.body;

  if (!storeInfo) {
    throw new BadRequestError("Invalid Store");
  }

  if (!startTime) {
    throw new BadRequestError("Appointment start time is required");
  }

  if (!endTime) {
    throw new BadRequestError("Appointment end time is required");
  }

  const store = await Store.findById(storeInfo);

  if (!store) {
    throw new NotFoundError("Store was not found in database..");
  }

  console.log(store);

  const appointment = await Appointment.create(req.body);
  res.status(StatusCodes.CREATED).json({ appointment });
};

const getAppointment = async (req, res, next) => {
  const appointmentId = req.params.id;
  const userId = req.user.userId;
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    createdBy: userId,
  });

  if (!appointment) {
    throw new NotFoundError("User does not have any appointments");
  }

  res.status(StatusCodes.OK).json({ appointment });
};

const getAppointmentUserSide = async (req, res, next) => {
  const userId = req.user.userId;
  const appointments = await Appointment.aggregate([
    {
      $match: {
        createdBy: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "stores",
        localField: "storeInfo",
        foreignField: "_id",
        as: "store_details",
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        paid: 1,
        paymentType: 1,
        servicesSelected: 1,
        createdAt: 1,
        updatedAt: 1,
        storeInfo: 1,
        endTime: 1,
        startTime: 1,
        store_details: {
          $arrayElemAt: ["$store_details", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        paid: 1,
        paymentType: 1,
        servicesSelected: 1,
        createdAt: 1,
        updatedAt: 1,
        endTime: 1,
        startTime: 1,
        store_details: {
          _id: "$store_details._id",
          phone: "$store_details.phone",
          address: "$store_details.address",
          shopName: "$store_details.shopName",
          email: "$store_details.email",
          state: "$store_details.state",
          city: "$store_details.city",
          area: "$store_details.locationInCity",
          landmark: "$store_details.landMark",
          categories: "$store_details.categories",
          website: "$store_details.website",
        },
      },
    },
  ]);

  if (!appointments) {
    throw new NotFoundError("Appointment not found");
  }

  res.status(StatusCodes.OK).json(appointments);
};

const getAll = async (req, res) => {
  const appointments = await Appointment.find({
    createdBy: req.user.userId,
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ appointments, count: appointments.length });
};

const getAppointmentStats = async (req, res) => {};

const deleteAppointment = async (req, res, next) => {
  const { userId } = req.user;
  const appointmentId = req.params.id;

  const appointment = await Appointment.findOneAndRemove({
    _id: appointmentId,
    createdBy: userId,
  });

  if (!appointment) {
    throw new NotFoundError("Appointment not found");
  }
  res.status(StatusCodes.OK).json({ msg: "Deleted sucessfully" });
};

const patchAppointment = async (req, res, next) => {
  const { userId } = req.user;
  const appointmentId = req.params.id;
  const { status, startTime, endTime, paid, paymentType, servicesSelected } =
    req.body;

  if (
    !status &&
    !startTime &&
    !endTime &&
    !paid &&
    !paymentType &&
    !servicesSelected
  ) {
    throw new BadRequestError(
      "Atleast one field from the following is required to perform this action: Status, Start Time, End Time, Paid(Boolean), Payment Type, Services Selected"
    );
  }

  const appointment = await Appointment.findOneAndUpdate(
    { _id: appointmentId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!appointment) {
    throw new NotFoundError("Appointment not found");
  }
  res.status(StatusCodes.OK).json({ appointment });
};

module.exports = {
  getAppointment,
  getAll,
  getAppointmentStats,
  deleteAppointment,
  patchAppointment,
  createAppointment,
  getAppointmentUserSide,
};
