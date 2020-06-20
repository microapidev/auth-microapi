const router = require('express').Router();
const SignUp = require('../controller/SignUp')
const db = require('../models')



//**HARDCODED USER**//
//POST - /api/auth/current-user
//msg - Get current user
router.get('/current-user', (req, res, next) => {
	res.json({
		name: "khalifa",
		email: "khalifa@gmail.com",
		isAdmin: true
	})
})

//POST - /api/auth/current-user
//msg - Register route
router.post('/register',SignUp.SignUp)

//POST - /api/auth/current-user
//msg - Login route
router.post('/login')

//POST - /api/auth/current-user
//msg - LogOut route
router.get('/logout')

module.exports = router;