const User = require('../../models/User');
const CryptoJS = require('crypto-js');
const { UnauthenticatedError, BadRequestError, NotFoundError } = require('../../errors/index');
const { StatusCodes } = require('http-status-codes');

const patchUser = async (req, res, next) => {
    if (req.user.isMod) {
        s
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedUser) {
            throw new NotFoundError('User does not exist');
        }

        res.status(StatusCodes.OK).json({ updatedUser });
    }
    else {
        throw new UnauthenticatedError('You are not authorized for this action!')
    }
}

const deleteUser = async (req, res, next) => {
    if (req.user.isMod) {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            throw new NotFoundError('User not found.')
        }
        res.status(StatusCodes.OK).json('User has been deleted');

    }
    else {
        throw new UnauthenticatedError('You are not authorized for this action!')
    }
}

const getUser = async (req, res, next) => {
    if (req.user.isMod) {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new NotFoundError('User not found.')

        }
        const { password, ...info } = user._doc
        res.status(200).json(info);
    }
    else {
        throw new UnauthenticatedError('You are not authorized for this action!')
    }
}

const getAllUsers = async (req, res) => {
    const query = req.query.new;
    if (req.user.isMod) {
        const users = query ? await User.find().sort({ _id: -1 }).limit(10) : await User.find();
        if (users.length === 0 || !users) {
            throw new NotFoundError('Users not found')
        }
        res.status(200).json(users);
    }
    else {
        throw new UnauthenticatedError('You are not authorized for this action!')
    }
}

const getUserStats = async (req, res) => {
    const today = new Date();
    const lastYear = Date.setFullYear(today.setFullYear() - 1);
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
        "December"
    ];

    if (req.user.isMod) {

        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            }, {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 }
                }
            }
        ]);

        if (!data) {
            throw new NotFoundError('Stats not found')
        }

        res.status(200).json({ data });
    } else {
        throw new UnauthenticatedError('You are not authorized for this action!')
    }
}


module.exports = {
    patchUser,
    deleteUser,
    getUser,
    getAllUsers,
    getUserStats
}
