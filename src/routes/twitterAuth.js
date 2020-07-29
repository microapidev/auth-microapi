require("dotenv").config();
const twitterRoute = require("express").Router();
const passport = require("passport");
const createTwitterStrategy = require("../config/passport/twitterStrategy");

twitterRoute.get("/", passport.authenticate(createTwitterStrategy()));

twitterRoute.get(
  "/callback",
  passport.authenticate(createTwitterStrategy(), { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(
      "https://upbeat-leavitt-2a7b54.netlify.app/pages/dashboard.html"
    );
  }
);

module.exports = twitterRoute;
