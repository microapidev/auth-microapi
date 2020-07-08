const userRouter = require('express').Router();

const { registerValidation, loginValidation } = require('../utils/validation/joiValidation');

const { auth } = require('../utils/middleware');

const { userRegistration, userLogin } = require('../controllers/auth');
const SessionMgt = require('../services/SessionManagement');


userRouter.get('/active', auth, (req, res) => {
  res.status(200).json({
    _id: req.user.id,
    isAdmin: req.user.isEmailVerified,
    isAuth: true,
    email: req.user.email,
    username: req.user.username,
  });
});

userRouter.route('/register')
  .get(SessionMgt.checkSession, (request, response) => {
    response.redirect('/');
  })
  .post(registerValidation(), userRegistration);

userRouter.route('/login')
  .get(SessionMgt.checkSession, (request, response) => {
    response.redirect('/');
  })
  .post(loginValidation(), userLogin);

userRouter.get('/logout', async (request, response) => {
  response.clearCookie('connect.sid');
  request.session.destroy();

  // response.redirect('/');
  response.status(200).send({
    success: true,
  });
});


module.exports = userRouter;
