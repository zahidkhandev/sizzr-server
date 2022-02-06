const router = require("express").Router();
const verify = require("../../verifyToken");
const { getAllByUser, getStoreByUser } = require("../controllers/store/byUser");
const {
  getStoreStats,
  getAll,
  getStore,
  deleteStore,
  patchStore,
} = require("../controllers/store/vendor");

//USER GET STORE
router.get("/user/:id", getStoreByUser);

router.get("/user", getAllByUser);

//GET ALL
router.get("/", getAll);

//GET USER STATS

router.get("/stats", verify, getStoreStats);

//UPDATE
router.patch("/:id", verify, patchStore);

//DELETE

router.delete("/:id", verify, deleteStore);

//GET
router.get("/:id", getStore);

module.exports = router;
