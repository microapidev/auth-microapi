require('dotenv').config();
const fbRouter = require('express').Router();
const passport = require('passport');




fbRouter.get('/', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

fbRouter.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('https://upbeat-leavitt-2a7b54.netlify.app/pages/dashboard.html');
  });


module.exports = fbRouter;
