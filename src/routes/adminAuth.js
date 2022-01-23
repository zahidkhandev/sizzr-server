const router = require("express").Router();
const Admin = require('../models/Admin');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError, BadRequestError } = require('../errors/index');
const { StatusCodes } = require("http-status-codes");
const verify = require('../../verifyToken')

router.post('/register', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newUser = new Admin({
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            address: req.body.address,
            position: req.body.position,
            profilePic: req.body.profilesPic,
            isAdmin: req.body.isAdmin,
        });

        const user = await newUser.save();
        res.status(StatusCodes.OK).json(user);
    }
    else {
        throw new UnauthenticatedError('You are not allowed to register new employees')
    }
})

router.post('/login', async (req, res) => {

    const user = await Admin.findOne({ email: req.body.email })

    if (!user) {
        throw new BadRequestError('Wront email or password.')
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
        throw new BadRequestError('Wront email or password.')
    }

    const accessToken = user.createJWT();

    const { password, ...info } = user._doc;

    return res.status(200).json({ ...info, accessToken });

})

module.exports = router;