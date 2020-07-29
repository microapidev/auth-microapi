require("dotenv").config();
const fbRouter = require("express").Router();
const passport = require("passport");
const createFacebookStrategy = require("../config/passport/facebookStrategy");

fbRouter.get(
  "/",
  passport.authenticate(createFacebookStrategy(), {
    scope: ["email", "public_profile"],
  })
);

fbRouter.get(
  "/callback",
  passport.authenticate(createFacebookStrategy(), {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(
      "https://upbeat-leavitt-2a7b54.netlify.app/pages/dashboard.html"
    );
  }
);

module.exports = fbRouter;
