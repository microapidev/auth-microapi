require("dotenv").config();
const twitterRoute = require("express").Router();
const passport = require("passport");

twitterRoute.get("/auth/twitter", passport.authenticate("twitter"));

twitterRoute.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = twitterRoute;
