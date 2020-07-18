const userRouter = require('express').Router();
const { registerValidation, loginValidation } = require('../utils/validation/joiValidation');
const { auth, authorizeUser } = require('../middlewares/middleware');
const UserController = require('../controllers/auth');
const { forgotValidation, resetPasswordValidation } = require('../utils/validation/joiValidation');
const SessionMgt = require('../services/SessionManagement');


module.exports = () => {

  // userRouter.get('/active', auth, (req, res) => {
  //   res.status(200).json({
  //     _id: req.user.id,
  //     isAdmin: req.user.isEmailVerified,
  //     isAuth: true,
  //     email: req.user.email,
  //     username: req.user.username,
  //   });
  // });

  userRouter.route('/active')
    // .get(SessionMgt.checkSession, (request, response) => {
    //   response.redirect('/');
    // })
    .get(UserController.activeUser);

  userRouter.route('/enable')
    // .get(SessionMgt.checkSession, (request, response) => {
    //   response.redirect('/');
    // })
    .get(UserController.enable2FA);

  userRouter.route('/register')
    .get(SessionMgt.checkSession, (request, response) => {
      response.status(200).json({
        success: true
      });
    })
    .post(registerValidation(), UserController.register);

  userRouter.route('/login')
    .get(SessionMgt.checkSession, (request, response) => {
      response.status(200).json({
        success: true
      });
    })
    .post(loginValidation(), UserController.login);

  userRouter.route('/verify')
    // .get(SessionMgt.checkSession, (request, response) => {
    //   response.redirect('/');
    // })
    .get(UserController.otpVerify);

  userRouter.get('/logout', async (request, response) => {
    response.clearCookie('user_sid', { path: '/' });

    request.session.destroy();

    // response.redirect('/');
    response.status(200).json({
      success: true,
      message: 'Redirect user to login at GET: /api/user/login'
    });
  });

  userRouter.post('/password/reset', authorizeUser, forgotValidation(), UserController.forgotPassword);

  userRouter.get('/password/:token', (request, response, next) => {
    response.redirect(`/pages/forgot-new/?token=${request.params.token}`);
  });

  userRouter.patch('/password/:token', authorizeUser, resetPasswordValidation(), UserController.resetPassword);

  return userRouter;
};

