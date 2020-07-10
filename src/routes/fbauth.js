require('dotenv').config();
const fbRouter = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');




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
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL:`${process.env.BASE_URL}/callback`,
},
((accessToken, refreshToken, profile, cb) => {
  User.findOrCreate({ facebookId: profile.id }, (err, user) => {
    return cb(err, user);
  });

})
));
fbRouter.get('/', passport.authenticate('facebook'));

fbRouter.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
  // Successful authentication, redirect home.
    res.status(200).json({
      success: true
    });
    res.redirect('/');

  });


module.exports = fbRouter;
