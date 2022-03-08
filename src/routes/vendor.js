const router = require("express").Router();
const verify = require("../../verifyToken");
const {
  generateArtistLink,
  getStoreEmployees,
  verifyEmployee,
  removeEmployee,
} = require("../controllers/store/artists");
const {
  getAllByUser,
  getStoreByUser,
  getByLocation10Kms,
} = require("../controllers/store/byUser");
const {
  addNewService,
  addNewCategory,
  deleteCategory,
  updateService,
  deleteService,
  getServices,
  getOneService,
} = require("../controllers/store/services");
const {
  getStoreStats,
  getAll,
  getStore,
  deleteStore,
  patchStore,
  uploadImage,
  getImages,
  deleteImage,
} = require("../controllers/store/vendor");

//Reviews

// router.get("/reviews/:id");

//Artsits
router.get("/artists/generate/:id", verify, generateArtistLink);
router.patch("/artists/verify/:id", verify, verifyEmployee);
router.patch("/artists/remove/:id", verify, removeEmployee);

router.get("/artists/:id", verify, getStoreEmployees);

//USER GET STORE

router.get("/user", getAllByUser);
router.get("/user/10", getByLocation10Kms);

router.get("/user/:id", getStoreByUser);

//SERVICES

//Add services
router.get("/service/single/:id", verify, getOneService);

router.get("/service/category/:id", verify, getServices);
router.patch("/service/category/add/:id", verify, addNewCategory);
router.patch("/service/category/delete/:id", verify, deleteCategory);

router.patch("/service/add/:id", verify, addNewService);
router.patch("/service/delete/:id", verify, deleteService);
router.patch("/service/update/:id", verify, updateService);

//GET ALL
router.get("/", getAll);

//GET USER STATS

router.get("/stats", verify, getStoreStats);

//IMAGES
router.post("/images/:id", verify, uploadImage);
router.get("/images/:id", verify, getImages);
router.delete("/images/:id", verify, deleteImage);

//UPDATE

router.patch("/:id", verify, patchStore);

//DELETE

router.delete("/:id", verify, deleteStore);

//GET
router.get("/:id", verify, getStore);

module.exports = router;
