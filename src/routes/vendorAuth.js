const router = require("express").Router();
const Store = require('../models/Store');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken')


router.post('/login', async (req, res) => {
    try {
        const user = await Store.findOne({ email: req.body.email })
        !user && res.status(401).json('Wrong password or username!')

        // const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        // const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        const originalPassword = user.password;

        originalPassword !== req.body.password &&
            res.status(401).json('Wrong username or password');

        const accessToken = jwt.sign(
            { storeId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '5d' }
        )

        const { password, ...info } = user._doc;

        res.status(200).json({ ...info, accessToken });

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;