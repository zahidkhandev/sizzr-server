const { StatusCodes } = require("http-status-codes");
const Store = require("../../models/Store");
const UnverifiedStore = require("../../models/UnverifiedStores");
const CryptoJS = require("crypto-js");
var generator = require("generate-password");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../../errors/index");
const AWS = require("aws-sdk");
const { sendRawEmail, sendEmail } = require("../../aws/verifiedemail");

//---------------VERIFIED STORE FUNCTIONS---------------

const createStore = async (req, res) => {
  if (req.user.isMod || req.user.isAdmin === true) {
    var password = generator.generate({
      length: 10,
      numbers: true,
    });

    //TODO ENCRYPT PASSWORD HERE AND CHECK IF ALL DATA EXISTS BEFORE CREATING STORE
    var encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString();
    req.body.password = password;
    const newStore = new Store(req.body);
    const savedStore = await newStore.save();
    res.status(StatusCodes.OK).json({ savedStore });
  } else {
    throw new UnauthenticatedError("You are not authorized for this action!");
  }
};

const deleteStore = async (req, res) => {
  if (req.user.isMod === true || req.user.isAdmin === true) {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      throw new NotFoundError("Store not found");
    }
    res.status(StatusCodes.OK).json("Store has been deleted");
  } else {
    throw new UnauthenticatedError("You are not authorized for this action!");
  }
};

const getStore = async (req, res, next) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    throw new NotFoundError("Store not found");
  }

  const { password, ...info } = store._doc;
  res.status(200).json({ info });
};

const sendCreatedEmail = async (req, res, next) => {
  const toEmail = req.body.email;

  const emailResponse = await sendEmail("inboxzahidkhan@gmail.com", "Zahid");

  console.log(emailResponse);

  res.json({ emailResponse });
};

//---------------UNVERIFIED STORE FUNCTIONS---------------

const getUnverifiedStore = async (req, res, next) => {
  if (req.user.isMod || req.user.isAdmin) {
    const stores = await UnverifiedStore.find().sort({ _id: 1 }).limit(10);

    if (!stores) {
      throw new NotFoundError("Stores not found.");
    }
    res.status(StatusCodes.OK).json(stores);
  } else {
    throw new UnauthenticatedError("You are not authorized for this action!");
  }
};

const deleteUnverifiedStore = async (req, res) => {
  if (req.user.isMod || req.user.isAdmin) {
    const store = await UnverifiedStore.findByIdAndDelete(req.params.id);

    if (!store) {
      throw new NotFoundError("Store not found.");
    }
    res.status(StatusCodes.OK).json({ msg: "Store has been deleted" });
  } else {
    throw new UnauthenticatedError("You are not authorized for this action!");
  }
};

module.exports = {
  createStore,
  deleteStore,
  getStore,
  getUnverifiedStore,
  deleteUnverifiedStore,
  sendCreatedEmail,
};
