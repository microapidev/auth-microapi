const router = require('express').Router();
const express = require("express");
const {
	protect
} = require("../middleware/auth");
const {
	register,
	login,
	getUser,
	logOut
} = require("../controllers/auth");

// A protected Route
router.get("/home", protect, (req,res) => {
		res.status(200).json({success: true, message: "hola"});

});


router.post('/register', register)


router.post('/login', login)

//URL - /api/v1/auth/current-user
// Get current User credentials
router.get('/getuser', protect, getUser)
//msg - LogOut route
router.get('/logout', protect, logOut)

module.exports = router;