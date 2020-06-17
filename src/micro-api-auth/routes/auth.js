const router = require('express').Router()
const jwt = require('jsonwebtoken');
const User = require('../models/user');


//@VERB - POST
//@Endpoint - /api/auth/register
//@User register route
router.post('/register', async (req, res, next) => {

})

//@VERB - POST
//@Endpoint - /api/auth/login
//@User login route
router.post('/login', async (req, res, next) => {
	 try {
        const user = await User.findOne({
            email: req.body.email
        });
        const {
            id,
            username,
        } = user;
        const isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            const token = jwt.sign({
                id,
                username,
            }, process.env.SECRET_KEY)
            return res.status(200).json({
                id,
                username,
                token
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Email/Password"
            })
        }
    } catch (err) {
        return next({
            status: 400,
            message: err.message || "Invalid Email/Password"
        })
    }
})

module.exports = router

