const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: [true, 'Email is a required field'], unique: [true, 'An account is already associated with this email'] },
    phoneNumber: {
        type: String,
        unique: [true, 'An account is already associated with this phone number'],
        sparse: true,
    },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, default: '' },
    appointments: { type: Array },
    favorites: { type: Array },
}, { timestamps: true })

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
    )
}

module.exports = mongoose.model('User', UserSchema);