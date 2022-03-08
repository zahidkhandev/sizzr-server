const router = require("express").Router();
const verify = require("../../verifyToken");
const {
  createReview: createArtistReview,
} = require("../controllers/user/artistReviews");
const {
  createReview: creatStoreReview,
} = require("../controllers/user/storeReviews");
const {
  getAllUsers,
  getUserStats,
  getUser,
  patchUser,
  deleteUser,
} = require("../controllers/user/users");

//StoreReviews
router.post("/store", verify, creatStoreReview);

//ArtistReviews
router.post("/artist", verify, createArtistReview);

module.exports = router;
