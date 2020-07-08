const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const route = express.Router();

route.get('/', passport.authenticate('google', { 
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
})
);

route.get('/callback', 
  passport.authenticate('google', {failureRedirect: '/api/auth/google'}), 
  (req, res) => {
    console.log(req.user);
    res.status(200).json({
      success: true,
      message: 'Google authenticated',
      user: req.user
    });
  });

module.exports = route;