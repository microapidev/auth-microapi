const adminRouter = require('express').Router();
// const connectDB = require('../controllers/db');
const { 
  registerValidation, 
  loginValidation, 
  forgotValidation, 
  resetPasswordValidation 
} = require('../utils/validation/joiValidation');
const Admin = require('../models/admin'); 
// const { createVerificationLink } = require('../utils/EmailVerification');
const { adminForgotPassword, adminResetPassword } = require('../controllers/admin');

adminRouter.post('/register', registerValidation(), async (request, response) => {
  // Adds a new admin to Auth-MicroApi DB 
  let user = await Admin.findOne({ email: request.body.email });
  if (user) {
    return response.status(403).json({
      success: false,
      message: 'Email address already in use',
    });
  }
  user = new Admin(request.body);
  user = await user.save();

  // DON'T DELETE: Admin acc. verification
  // Send a confirmation link to email
  // const mailStatus = await createVerificationLink(user, request);
  // console.log('===MailStatus===');
  // console.log(mailStatus);

  return response.status(201).json({
    success: true,
    message: user.toJSON()
  });
});

adminRouter.post('/getkey', loginValidation(), async (request, response) => {
  // New API KEY for admin
  let user = await Admin.findOne({ email: request.body.email });
  if (!user) {
    response.status(401).json({
      loginSuccess: false,
      message: 'Auth failed, email not found',
    });
  }

  const isMatch = user.matchPasswords(request.body.password);
  if (!isMatch) {
    return response.status(401).json({ loginSuccess: false, message: 'Wrong password' });
  }

  response.status(200).json({
    message: 'API_KEY should be set in authorization header as - Bearer <token> - for subsequent user requests',
    API_KEY: user.generateAPIKEY(),
  });
});

adminRouter.post('/forgot-password', forgotValidation(), adminForgotPassword);

adminRouter.patch('/reset-password/:token', resetPasswordValidation(), adminResetPassword);

module.exports = adminRouter;