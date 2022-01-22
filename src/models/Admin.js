const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    profilePic: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    isMod: { type: Boolean, default: true },
    position: { type: String, default: 'emp', enum: ['co', 'manager', 'emp', 'ceo'], message: 'Please enter a valid position' }
}, { timestamps: true })

AdminSchema.methods.createJWT = function () {
    return jwt.sign(
        {
            adminId: this._id,
            isAdmin: this.isAdmin,
            isMod: this.isMod
        },
        process.env.SECRET_KEY,
        { expiresIn: '5d' }
    )
}

module.exports = mongoose.model('Admin', AdminSchema);

