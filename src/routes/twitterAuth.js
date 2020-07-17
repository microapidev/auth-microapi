require('dotenv').config();
const twitterRoute = require('express').Router();
const passport = require('passport');

twitterRoute.get('/', passport.authenticate('twitter'));

twitterRoute.get(
  '/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('https://upbeat-leavitt-2a7b54.netlify.app/index.html');
  }
);

module.exports = twitterRoute;
