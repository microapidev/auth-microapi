const express = require ("express");
const passport = require("passport");
const { register, login, logOut, getUser} = require ("../controllers/auth");
const { protect } = require("../middleware/auth");


const router = express.Router();

router.post("/register",  register);
router.post("/login", login);


router.get("/home", protect, () => {
    console.log("hello");
})

router.get("/getuser", protect, getUser);
module.exports = router;

router.get("/logout", protect,logOut);