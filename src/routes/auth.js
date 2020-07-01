/* -------- 🎃 Any client accessing this route is implicitly a guest,-----
-------- hence eliminating the need for user role 🎃 --------- */

const User = require('../models/user');
const userRouter = require('express').Router();
const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const { registerValidation, loginValidation } = require('../utils/validation/joiValidation');
// const { auth } = require('../utils/middleware');
const {createVerificationLink} = require('../utils/EmailVerification');



// guestRouter.get('/active', auth, (req, res) => {
//   res.status(200).json({
//     _id: req.user._id,
//     isAdmin: req.user.isAdmin,
//     isAuth: true,
//     email: req.user.email,
//     username: req.user.username,
//   });
// });


userRouter.post('/register', registerValidation(), async (request, response) => {
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
  console.log(mailStatus);

  return response.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { ...user.toJSON() },
  });
});

userRouter.post('/login', loginValidation(), async (request, response) => {
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
  const isMatch = user.matchPasswords(password);

  if (!isMatch) {
    return response.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Send token in response cookie for user session
  user = user.generateToken();

  response.cookie('w_authExp', user.tokenExp);
  response.cookie('w_auth', user.token).status(200).json({
    success: true,
    userId: user.id
    // token: user.token
  });
});

userRouter.get('/logout', async (request, response) => {
  const query = {
    id: request.body.id
  };

  const update = {
    token: '',
    tokenExp: ''
  };

  await User.findOneAndUpdate(query, update);

  return response.status(200).send({
    success: true,
  });
});



module.exports = userRouter;
