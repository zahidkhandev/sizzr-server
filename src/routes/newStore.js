const router = require('express').Router();
const UnverifiedStore = require('../models/UnverifiedStores');
const createError = require('http-errors');


router.post("/", async (req, res, next) => {
    const newStore = new UnverifiedStore(req.body);
    const savedStore = await newStore.save();
    res.status(201).json(savedStore);
});


module.exports = router;
