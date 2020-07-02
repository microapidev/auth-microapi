const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

const User = require("../models/user");
const userRouter = require("express").Router();
const {
  registerValidation,
  loginValidation,
  forgotValidation,
  resetPasswordValidation,
} = require("../utils/validation/joiValidation");
const { auth } = require("../utils/middleware");
const { createVerificationLink } = require("../utils/EmailVerification");
const {
  userForgotPassword,
  userResetPassword,
} = require("../controllers/auth");
const trustProxy = false;
if (process.env.DYNO) {
  // Apps on heroku are behind a trusted proxy
  trustProxy = true;
}

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

console.log(process.env);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:5000/api/auth/twitter/callback",
      proxy: trustProxy,
    },
    function (token, tokenSecret, profile, cb) {
      User.findOrCreate({ twitterId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

userRouter.get("/user/active", auth, (req, res) => {
  res.status(200).json({
    _id: req.user.id,
    isAdmin: req.user.isEmailVerified,
    isAuth: true,
    email: req.user.email,
    username: req.user.username,
  });
});

userRouter.get("/twitter", passport.authenticate("twitter"));

userRouter.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

userRouter.post(
  "/register",
  registerValidation(),
  async (request, response) => {
    // Register as guest
    const { email } = request.body;

    // Check if user email is taken in DB
    let user = await User.findOne({ email });

    if (user) {
      return response.status(403).json({
        success: false,
        message: "Email address already in use",
      });
    }

    user = new User({ ...request.body });
    user = await user.save();

    // Send a confirmation link to email
    const mailStatus = await createVerificationLink(user, request);
    console.log(mailStatus);
    const { verificationUrl } = mailStatus;

    return response.status(201).json({
      success: true,
      verificationUrl,
      message: "Account created successfully",
      data: { ...user.toJSON() },
    });
  }
);

userRouter.post("/login", loginValidation(), async (request, response) => {
  // Login as guest
  const { email, password } = request.body;

  // check if user has verified email

  // check if user exists in DB
  let user = await User.findOne({ email });

  if (!user) {
    return response.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // check if password provided by user matches user password in DB
  const isMatch = await user.matchPasswords(password);
  // console.log(" isMatch", isMatch)

  if (!isMatch) {
    return response.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // console.log(" isMatch", isMatch)

  // Send token in response cookie for user session
  let client = await user.generateToken();

  response.cookie("w_authExp", client.tokenExp);
  response.cookie("w_auth", client.token).status(200).json({
    success: true,
    userId: client.id,
    token: client.token,
  });
});

userRouter.get("/logout", async (request, response) => {
  const query = {
    id: request.body.id,
  };

  const update = {
    token: "",
    tokenExp: "",
  };

  await User.findOneAndUpdate(query, update);

  return response.status(200).send({
    success: true,
  });
});

userRouter.post("/forgot-password", forgotValidation(), userForgotPassword);

userRouter.patch(
  "/reset-password/:token",
  resetPasswordValidation(),
  userResetPassword
);

module.exports = userRouter;
