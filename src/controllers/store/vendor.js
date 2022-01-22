const router = require('express').Router();
const Store = require('../../models/Store');
const CryptoJS = require('crypto-js');
const verify = require('../../../verifyToken');
const createError = require('http-errors');
const mongoose = require('mongoose')



const getStore = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.id);

        if (!store) {
            throw createError(404, "Store does not exist");
        }

        const { password, ...info } = store._doc
        res.status(200).json(info);

    } catch (err) {

        if (err instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Store ID'))
            return;
        }
        next(err);
    }
}

const getAll = async (req, res) => {
    const query = req.query.new;
    // if (req.user.isAdmin) {
    try {
        const users = query ? await Store.find().sort({ _id: -1 }).limit(10) : await Store.find();

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json(err);
    }
}

const getStoreStats = async (req, res) => {
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
        "December"
    ];

    if (req.user.isMod) {
        try {
            const data = await Store.aggregate([
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
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You are not allowed to perform this action')
    }

}

const deleteStore = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const result = await Store.findByIdAndDelete(req.params.id);
            if (!result) {
                throw createError(404, "User does not exist");
            }
            else {
                res.status(200).json('User has been deleted');
            }

        } catch (err) {
            if (err instanceof mongoose.CastError) {
                next(createError(400, 'Invalid User ID'))
                return;
            }
            next(err);
        }
    }
    else {
        res.status(403).json('You can only delete your account!')
    }
}


const patchStore = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        if (req.body.password) {
            // req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
        }
        try {
            const updatedUser = await Store.findByIdAndUpdate(req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!updatedUser) {
                throw createError(404, 'User does not exist');
            }

            res.status(200).json(updatedUser);

        } catch (err) {
            if (err instanceof mongoose.CastError) {
                next(createError(400, 'Invalid   ID'))
                return;
            }
            next(err);
        }
    }
    else {
        res.status(403).json('You can update only your account!')
    }
}



module.exports = {
    getStore,
    getAll,
    getStoreStats,
    deleteStore,
    patchStore
}