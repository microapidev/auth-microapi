const router = require('express').Router();
const db = require('../models');
const User = require('../models/user');
import emailcheck from "email-check"

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

// register process
router.post('/register', function(req, res){
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	
	req.checkBody('username', 'username is required').notEmpty();
	req.checkBody('email', 'email is required').notEmpty();	
	req.checkBody('password', 'password is required').notEmpty();

	let errors = req.validationErrors();
	emailcheck(email)
		.then(() => {
			User.create(req.body)
				.then(() => {
					res.send(req.body);
				})
				.catch((error) => 
				res.json({serverErrorDublicateEmail: "The email address is already exist"})
			)

		})
		.catch(() => {
			res.json({serverErrorEmailExistence: "The email address does not exist. please try a valid one"});
		})
	if(errors){
		return res.json({ 'message': errors });
	}else{
		let newUser = new User({
			username:username,
			email:email,
			password:password,
			
			});
			bcrypt.genSalt(10,function(err, salt){
				bcrypt.hash(newUser.password, salt, function(err, salt){
					if(err){
						return res.json({ 'message': err });
					}
					newUser.password = hash;
					newUser.save(function(err){
						if(err){
							return res.json({ 'message': err });
						}else{
							return res.json({ 'message': 'You are successfully registered' });					}
				});
			});
		});
	}
	
});

//POST - /api/auth/current-user
//msg - Login route
router.post('/login')

//POST - /api/auth/current-user
//msg - LogOut route
router.get('/logout')

module.exports = router;