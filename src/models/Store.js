const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    password: { type: String, required: true },
    shopName: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    address: { type: String },
    whatsAppNumber: { type: String },
    whatsAppUpdates: { type: String, default: true },
    state: { type: String },
    city: { type: String },
    locationInCity: { type: String },
    landMark: { type: String },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    gstNumber: { type: String },
    gstCertificate: { type: String },
    panNumber: { type: String },
    yearOfEstablishment: { type: String },
    licenseNumber: { type: String },
    website: { type: String },
    businessType: { type: String },
    isKidFriendly: { type: Boolean },

    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
    },
    categories: { type: Array },
    owner: {
      email: { type: String },
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      pincode: { type: String },
      aadhar: { type: String },
    },
    featuredImage: { type: String },
    images: [
      {
        public_id: { type: String },
        secure_url: { type: String },
        desc: { type: String },
      },
    ],
    services: [
      {
        categoryName: {
          type: String,
        },
        services: [
          {
            name: { type: String },
            cost: { type: Number },
            varCost: { type: Number },
            duration: { type: Number },
            desc: { type: String },
            gender: { type: String },
            tags: { type: String },
            forKids: { type: Boolean },
            priceType: {
              type: String,
              enum: ["fixed", "variable", "hourly"],
              defalt: "fixed",
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

//ONE SERVICE ONLY BELONGS TO ONE CATEGORY... MANY SERVICES CAN BELONG TO THE SAME CATEOGRY.

module.exports = mongoose.model("Store", StoreSchema);
