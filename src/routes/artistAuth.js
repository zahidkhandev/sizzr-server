const {
  googleRegister,
  register,
  login,
} = require("../controllers/artists/auth");

const router = require("express").Router();

router.post("/google", googleRegister);

router.post("/register", register);

router.post("/login", login);

module.exports = router;
