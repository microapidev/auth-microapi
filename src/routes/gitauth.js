require('dotenv').config();
const gitRouter = require('express').Router();
const Admin = require('../models/admin');
const User = require('../models/user');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
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


gitRouter.get('/',
  passport.authenticate('github'));

gitRouter.get('/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('https://upbeat-leavitt-2a7b54.netlify.app/index.html');

  });



module.exports = gitRouter;
