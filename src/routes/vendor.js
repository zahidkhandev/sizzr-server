const router = require("express").Router();
const verify = require("../../verifyToken");
const { getAllByUser, getStoreByUser } = require("../controllers/store/byUser");
const {
  addNewService,
  addNewCategory,
  deleteCategory,
  updateService,
  deleteService,
  getServices,
} = require("../controllers/store/services");
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

//SERVICES

//Add services
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

//UPDATE
router.patch("/:id", verify, patchStore);

//DELETE

router.delete("/:id", verify, deleteStore);

//GET
router.get("/:id", getStore);

module.exports = router;
