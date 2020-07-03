require('dotenv').config();
const gitRouter = require('express').Router();
const Admin = require('../models/admin');
const User = require('../models/user');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const findOrCreate = require('mongoose-findorcreate');


// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {

  if(Admin){
    Admin.findById(id, function(err, user) {
      done(err, user);
    });
  }else{
    User.findById(id, function(err, user) {
      done(err, user);
    });
  }


});


// Github Auth
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://auth-microapi.herokuapp.com/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


 gitRouter.get('/auth/github',
    passport.authenticate('github'));

   gitRouter.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');

    });



module.exports = gitRouter;
