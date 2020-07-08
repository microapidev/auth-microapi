const adminRouter = require('express').Router();

const { registerValidation, loginValidation, forgotValidation, resetPasswordValidation } = require('../utils/validation/joiValidation');

const { adminRegister, adminGetKey, adminForgotPassword, adminResetPassword } = require('../controllers/admin');

adminRouter.post('/register', registerValidation(), adminRegister);

adminRouter.post('/getkey', loginValidation(), adminGetKey);

adminRouter.post('/forgot-password', forgotValidation(), adminForgotPassword);

adminRouter.patch('/reset-password/:token', resetPasswordValidation(), adminResetPassword);

module.exports = adminRouter;