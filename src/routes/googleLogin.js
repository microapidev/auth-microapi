const express = require("express");
const passport = require("passport");
const createGoogleStrategy = require("../config/passport/googleStrategy");
const route = express.Router();

route.get(
  "/",
  passport.authenticate(createGoogleStrategy(), {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

route.get(
  "/callback",
  passport.authenticate(createGoogleStrategy(), {
    failureRedirect: "/api/google",
  }),
  (req, res) => {
    console.log(req.user);
    res.status(200).json({
      success: true,
      message: "Google authenticated",
      user: req.user,
    });
  }
);

module.exports = route;
