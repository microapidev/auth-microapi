require("dotenv").config();
const fbRouter = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const findOrCreate = require("mongoose-findorcreate");

// use static serialize and deserialize of model for passport session support
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// facebook Auth
passport.use(
  new TwitterStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "https://auth-microapi.herokuapp.com/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOrCreate({ twitterid: profile.id }, (err, user) => {
        return cb(err, user);
      });
    }
  )
);
fbRouter.get("/auth/twitter", passport.authenticate("twitter"));

fbRouter.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = fbRouter;
