const router = require('express').Router();
const db = require('../models');
const User = require('../models/user');

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
router.post('/register')

//POST - /api/auth/current-user
//msg - Login route
router.post('/login', async(req, res, next){		
		
	//Checking if email or username exists
	const user = await User.findOne({$or:[{email:req.body.email},{username:req.body.username}]});

	if(!user) return res.status(400).json({'message':'Invalid Email or Password'});

	//Checking if password is correct
	await User.comparePassword(req.body.password, function(err){

		if (err) return res.status(400).json({ 'message': 'Invalid Email or Password' });

		
	});
	
	await User.generateToken(function(result) {

		const {token} = result;
		res.header('auth-token', token);
	});

	

});

//POST - /api/auth/current-user
//msg - LogOut route
router.get('/logout')

module.exports = router;