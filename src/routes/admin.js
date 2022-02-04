const router = require('express').Router();
const verify = require('../../verifyToken');
const { patchUser, deleteUser, getUser, getAllUsers, getUserStats } = require('../controllers/admin/user');
const { createStore, deleteStore, getStore, getUnverifiedStore, deleteUnverifiedStore, sendCreatedEmail } = require('../controllers/admin/store');




//---------------USERS---------------
//UPDATE 
router.patch('/users/update/:id', verify, patchUser)

//DELETE
router.delete('/users/delete/:id', verify, deleteUser);

//GET
router.get('/users/find/:id', verify, getUser);

//GET ALL
router.get('/users', verify, getAllUsers);

//GET USER STATS
router.get('/users/stats', verify, getUserStats);





//---------------STORE FUNCTIONS---------------

//---------------UNVERIFIED STORE FUNCTIONS---------------

//GET ALL

router.get('/store/unverified', verify, getUnverifiedStore);

//DELETE
router.delete("/store/unverified/delete/:id", verify, deleteUnverifiedStore);


router.post('/store/verification', sendCreatedEmail)



//---------------VERIFIED STORE FUNCTIONS---------------

//CREATE
router.post("/store/create", verify, createStore);

//DELETE
router.delete("/store/delete/:id", deleteStore);

//GET
router.get('/store/find/:id', getStore);


//EMAIL


module.exports = router;