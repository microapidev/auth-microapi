const router = require('express').Router();
const { User } = require('../models/user');
//const validation = require('../validation/authValidation');
const { auth } = require('../utils/middleware');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');


router.get('/active', auth, (req, res) => {
  res.cookie('w_auth', client.token);
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.isAdmin,
    isAuth: true,
    email: req.user.email,
    username: req.user.username,
  });
});
/* -------- 🎃 Any client accessing this route is implicitly a guest,-----
-------- hence eliminating the need for user role 🎃 --------- */

//const User = require('../models/user');
const userRouter = require('express').Router();
//const { registerValidation, loginValidation } = require('../utils/validation/joiValidation');
//const {createVerificationLink} = require('../utils/EmailVerification');
const { authorizeUser } = require('../utils/middleware');
const { 
  registerValidation, 
  loginValidation, 
  forgotValidation, 
  resetPasswordValidation 
} = require('../utils/validation/joiValidation');
const { createVerificationLink } = require('../utils/EmailVerification');
const { userForgotPassword, userResetPassword } = require('../controllers/auth');

userRouter.get('/active', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.isAdmin,
    isAuth: true,
    isVerified: req.user.isEmailVerified,
    email: req.user.email,
    username: req.user.username,
  });
});

userRouter.post('/register', registerValidation(), async (request, response) => {
  // Register as guest
  const { email } = request.body;
  res.cookie('w_auth', client.token);
  req.session.user = req.body;

  // Check if user email is taken in DB
  let user = await User.findOne({ email });

  if (user) {
    return response.status(403).json({
      success: false,
      message: 'Email address already in use',
    });
  }

  user = new User({ ...request.body });
  user = await user.save(
    req.session.user = user,
		req.flash('success'),
		res.redirect('/'),
  );

  // Send a confirmation link to email
  const mailStatus = await createVerificationLink(user, request);
  console.log(mailStatus);

  return response.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { ...user.toJSON() },
  });
});

userRouter.post("/login", loginValidation(), (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

userRouter.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true,
            message: "successfully logged you out"
        });
    });
    req.logout()
    res.clearCookie('w_auth');
    req.session.destroy();
    req.session.user = null;
});

userRouter.post('/forgot-password', forgotValidation(), userForgotPassword);

userRouter.patch('/reset-password/:token', resetPasswordValidation(), userResetPassword);

module.exports = userRouter;
