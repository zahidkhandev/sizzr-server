const mongoose = require("mongoose");


const StoreSchema = new mongoose.Schema({
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
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        }
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
        name: { type: String },
        id: { type: Number }
    },
    categories: [
        {
            name: { type: String },
            id: { type: Number }
        }
    ],
    owner: {
        email: { type: String },
        name: { type: String },
        phone: { type: String },
        address: { type: String },
        pincode: { type: String },
        aadhar: { type: String }
    },
    images: [
        {
            url: { type: String }
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Store', StoreSchema);