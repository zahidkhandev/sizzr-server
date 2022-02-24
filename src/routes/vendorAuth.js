const router = require("express").Router();
const Store = require("../models/Store");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const user = await Store.findOne({ email: req.body.email });
    if (user === null)
      res.status(401).json({ status: 401, msg: "Wrong username or password" });

    //TODO ENCRYPT AND DECRPT PASSWORD
    // const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    // const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    const originalPassword = user.password;

    originalPassword !== req.body.password &&
      res.status(401).json({ status: 401, msg: "Wrong username or password" });

    const accessToken = jwt.sign(
      { storeId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    const {
      shopName,
      address,
      gender,
      email,
      images,
      location,
      locationInCity,
      city,
      state,
      phone,
      _id,
      ...info
    } = user._doc;

    res.status(200).json({
      shopName,
      address,
      gender,
      email,
      images,
      location,
      locationInCity,
      city,
      state,
      phone,
      _id,
      accessToken,
      isVendor: true,
    });
  } catch (err) {
    res.status(500).json({ status: 500, msg: err });
  }
});

module.exports = router;
