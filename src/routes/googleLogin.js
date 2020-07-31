const express = require("express");
const passport = require("passport");
const createGoogleStrategy = require("../config/passport/googleStrategy");
const {
  authorizeUser,
  googleAuthProvider,
} = require("../middlewares/middleware");
const Admin = require("../models/admin");
const route = express.Router();

route.get("/", authorizeUser, googleAuthProvider, (req, res, next) =>
  passport.authenticate(createGoogleStrategy(req.provider), {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })(req, res, next)
);

route.get(
  "/callback",
  passport.authenticate(createGoogleStrategy(), {
    failureRedirect: "/api/google",
  }),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Google authenticated",
      user: req.user,
    });
  }
);

module.exports = route;
