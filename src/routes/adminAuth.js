const adminRouter = require('express').Router();

const { registerValidation, loginValidation, forgotValidation, resetPasswordValidation } = require('../utils/validation/joiValidation');

const { adminRegister, adminGetKey, adminForgotPassword, adminResetPassword } = require('../controllers/admin');

adminRouter.post('/register', registerValidation(), adminRegister);

adminRouter.post('/getkey', loginValidation(), adminGetKey);

adminRouter.post('/reset-password', forgotValidation(), adminForgotPassword);

adminRouter.get('/reset-password/:token', (request, response, next) => {
  response.status(200).send('It\'s cool you\'re here 😁, but you should be using postman to send a PATCH request to change password via this url!');
});

adminRouter.patch('/reset-password/:token', resetPasswordValidation(), adminResetPassword);

module.exports = adminRouter;