const express = require("express");
const passport = require("passport");
const { register, login, logOut, getUser, forgotpassword } = require("../controllers/auth");
const { protect } = require("../middleware/auth");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/logout", protect, logOut);

router.post("/forgotpassword", forgotpassword);

router.get("/getuser", protect, getUser);
module.exports = router;

