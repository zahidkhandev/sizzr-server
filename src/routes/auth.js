const router = require("express").Router();
const { googleRegister, register, login } = require("../controllers/user/auth");


//GOOGLE
router.post('/google', googleRegister);

router.post('/register', register);

router.post('/login', login)


module.exports = router;