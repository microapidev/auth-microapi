/* -------- 🎃 Any client accessing this route is implicitly an admin,-----
-------- hence eliminating the need for user role 🎃 --------- */

const adminRouter = require('express').Router();
// const connectDB = require('../controllers/db');
const { registerValidation, loginValidation } = require('../utils/validation/joiValidation');
const Admin = require('../models/admin'); 
const {createVerificationLink} = require('../utils/EmailVerification');

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

  // Send a confirmation link to email
  const mailStatus = await createVerificationLink(user, request);
  console.log('===MailStatus===');
  console.log(mailStatus);

  return response.status(201).json({
    success: true,
    message: 'Verify your email to proceed'
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

module.exports = adminRouter;