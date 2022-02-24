const verify = require("../../verifyToken");
const {
  getStoreByArtist,
  joinStore,
} = require("../controllers/artists/artist");
const { editArtistProfile } = require("../controllers/artists/profile");

const router = require("express").Router();

router.patch("/store/join/:id", verify, joinStore);

router.get("/store/:id", getStoreByArtist);

router.patch("/:id", verify, editArtistProfile);

module.exports = router;
