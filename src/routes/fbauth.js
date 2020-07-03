require('dotenv').config();
const fbRouter = require('express').Router();
const Admin = require('../models/admin');
const User = require('../models/user');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
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


// facebook Auth
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL:
    "https://auth-microapi.herokuapp.com/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    if (Admin){
      Admin.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }else{
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  }
));
fbRouter.get('/auth/facebook', passport.authenticate('facebook'));

fbRouter.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
  
});


module.exports = fbRouter;
