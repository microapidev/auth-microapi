const userRouter = require('express').Router();
const { userForgotPassword, userResetPassword } = require('../controllers/auth');
const { forgotValidation, resetPasswordValidation } = require('../utils/validation/joiValidation');


userRouter.post('/reset', forgotValidation(), userForgotPassword);
userRouter.get('/:token', (request, response, next) => {
  response.status(200).send('It\'s cool you\'re here 😁, but you should be using postman to send a PATCH request to change password via this url!');
});
userRouter.patch('/:token', resetPasswordValidation(), userResetPassword);

module.exports = userRouter;