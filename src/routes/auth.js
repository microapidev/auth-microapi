const User = require('../models/user');
const userRouter = require('express').Router();


const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const { registerValidation, loginValidation } = require('../utils/validation/joiValidation');
const {createVerificationLink} = require('../utils/EmailVerification');



// guestRouter.get('/active', auth, (req, res) => {
//   res.status(200).json({
//     _id: req.user.id,
//     isAdmin: req.user.isEmailVerified,
//     isAuth: true,
//     email: req.user.email,
//     username: req.user.username,
//   });
// });


const {
  registerValidation,
  loginValidation,
  forgotValidation,
  resetPasswordValidation
} = require('../utils/validation/joiValidation');
const { auth } = require('../utils/middleware');
const { createVerificationLink } = require('../utils/EmailVerification');
const { userForgotPassword, userResetPassword } = require('../controllers/auth');
const SessionMgt = require('../services/SessionManagement');


userRouter.get('/user/active', auth, (req, res) => {
  res.status(200).json({
    _id: req.user.id,
    isAdmin: req.user.isEmailVerified,
    isAuth: true,
    email: req.user.email,
    username: req.user.username,
  });
});

userRouter.route('/register')
  .get(SessionMgt.checkSession, (request, response) => {
    response.redirect('/');
  })
  .post(registerValidation(), async (request, response) => {
    // Register as guest
    const { email } = request.body;

    // Check if user email is taken in DB
    let user = await User.findOne({ email });

    if (user) {
      return response.status(403).json({
        success: false,
        message: 'Email address already in use',
      });
    }

    user = new User({ ...request.body });
    user = await user.save();

    // Send a confirmation link to email
    const mailStatus = await createVerificationLink(user, request);
    // console.log(mailStatus);
    const { verificationUrl } = mailStatus;

    return response.status(201).json({
      success: true,
      // verificationUrl,
      message: 'Account created successfully. We sent you mail to confirm your email address',
      data: { ...user.toJSON() },
    });
  });

userRouter.route('/login')
  .get(SessionMgt.checkSession, (request, response) => {  
    response.redirect('/');
  })
  .post(loginValidation(), async (request, response) => {
    // Login as guest
    const { email, password } = request.body;

    // check if user exists in DB
    let user = await User.findOne({ email });

    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // check if password provided by user matches user password in DB
    if (!await user.matchPasswords(password)) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    user = user.toJSON();

    // check if user has unverified email
    if (!user.isEmailVerified) {
      return response.status(401).json({
        success: false,
        message: 'Please verify your email to proceed'
      });
    }

    await SessionMgt.login(request, user);

    response.status(200).json({
      success: true,
      user: user.id,
      mesage: 'Login successful'
    });
  });

userRouter.get('/logout', async (request, response) => {
  response.clearCookie('user_sid');

  // response.redirect('/');
  response.status(200).send({
    success: true,
  });
});


userRouter.post('/forgot-password', forgotValidation(), userForgotPassword);

userRouter.patch('/reset-password/:token', resetPasswordValidation(), userResetPassword);


module.exports = userRouter;
