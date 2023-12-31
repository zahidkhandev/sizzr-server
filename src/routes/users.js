const router = require("express").Router();
const verify = require("../../verifyToken");
const { createReview } = require("../controllers/user/storeReviews");
const {
  getAllUsers,
  getUserStats,
  getUser,
  patchUser,
  deleteUser,
} = require("../controllers/user/users");

//GET ALL
router.get("/", getAllUsers);

//GET USER STATS
router.get("/stats", verify, getUserStats);

//GET DELETE AND PATCH USER
router
  .route("/:id")
  .get(verify, getUser)
  .patch(verify, patchUser)
  .delete(verify, deleteUser);

module.exports = router;
