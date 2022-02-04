const Store = require('../../models/Store');
const createError = require('http-errors');
const mongoose = require('mongoose')


const getStoreByUser = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.id, {
            shopName: 1,
            email: 1,
            phone: 1,
            address: 1,
            landMark: 1,
            website: 1,
            isKidFriendly: 1,
            images: 1,
            distance: 1,
            categories: 1,
            gender: 1,
            location: 1,
        });

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

const getAllByUser = async (req, res) => {
    const query = req.query.new;
    // if (req.user.isAdmin) {
    try {
        const users = query ? await Store.find({}, {
            shopName: 1,
            email: 1,
            phone: 1,
            address: 1,
            landMark: 1,
            website: 1,
            isKidFriendly: 1,
            images: 1,
            distance: 1,
            categories: 1,
            gender: 1,
            location: 1,
        }).sort({ _id: -1 }).limit(20) : await Store.find({}, {
            shopName: 1,
            email: 1,
            phone: 1,
            address: 1,
            landMark: 1,
            website: 1,
            isKidFriendly: 1,
            images: 1,
            distance: 1,
            categories: 1,
            gender: 1,
            location: 1,
        });

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getAllByUser,
    getStoreByUser
}