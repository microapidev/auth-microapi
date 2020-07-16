const userRouter = require('express').Router();
const { registerValidation, loginValidation } = require('../utils/validation/joiValidation');
const { auth, authorizeUser } = require('../utils/middleware');
const UserCtrl = require('../controllers/auth');
const { forgotValidation, resetPasswordValidation } = require('../utils/validation/joiValidation');
const SessionMgt = require('../services/SessionManagement');


module.exports = () => {

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
      response.status(200).json({
        success: true
      });
    })
    .post(registerValidation(), UserCtrl.register);

  userRouter.route('/login')
    .get(SessionMgt.checkSession, (request, response) => {
      response.status(200).json({
        success: true
      });
    })
    .post(loginValidation(), UserCtrl.login);

  userRouter.get('/logout', async (request, response) => {
    response.clearCookie('user_sid', { path: '/' });

    request.session.destroy();

    // response.redirect('/');
    response.status(200).json({
      success: true,
      message: 'Redirect user to login at GET: /api/user/login'
    });
  });

  userRouter.post('/password/reset', authorizeUser, forgotValidation(), UserCtrl.forgotPassword);

  userRouter.get('/password/:token', (request, response, next) => {
    response.status(200).send('It\'s cool you\'re here 😁, but you should be using postman to send a PATCH request to change password via this url!');
  });

  userRouter.patch('/:token', authorizeUser, resetPasswordValidation(), UserCtrl.resetPassword);

  return userRouter;
};

