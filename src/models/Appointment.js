const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    storeInfo: {
      type: mongoose.Types.ObjectId,
      ref: "Store",
      required: [true, "Please provide a shop"],
    },
    artistInfo: {
      type: mongoose.Types.ObjectId,
      ref: "Artists",
      required: [true, "Please choose an employee"],
    },
    status: {
      type: String,
      enum: [
        "Processing",
        "Accepted",
        "Rejected",
        "Cancelled",
        "Completed",
        "Missed",
      ],
      default: "Processing",
      message:
        "Enter valid status (Processing, Accepted, Rejected, Cancelled, Completed, Missed",
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paymentType: {
      type: String,
      enum: ["COD", "CARD", "PAYTM"],
      default: "COD",
    },
    servicesSelected: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
