/**=================================================================
 * ====   TITLE::     ADDING USER FORGOT AND RESET PASSWORD    ====
 * ====   AUTHOR:: jimoh19 <jemohkunle2007@gmail.com>           ====
 * ====   DATE::            1ST JULY 2020                      ====
 * =================================================================
 */

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendForgotPasswordMail } = require('../EmailFactory/index');
const User = require('../models/user');
const UserSrv = require('../services/auth');
const SessionMgt = require('../services/SessionManagement');
const { createVerificationLink } = require('../utils/EmailVerification');
const { JWT_ADMIN_SECRET } = require('../utils/config');
const CustomResponse = require('../utils/response');
const { CustomError } = require('../utils/CustomError');


class UserController{

  async register(req, res){
  
    const data = UserSrv.register(req);    
    return res.status(data.code).json(CustomResponse(data.message, data.user));

  }

  async login(req, res){

    const data = UserSrv.login(req);
    res.status(200).json(CustomResponse('Login successful', data.user));

  }

  async forgotPassword(req, res){
    
    const data = UserSrv.forgotPassword(req);
    return res
      .status(200)
      .json(
        CustomResponse(`A password reset link has been sent to ${data.user.email}`)
      );
    
  }

  async resetPassword(req, res){

    const data = await UserSrv.resetPassword(req);
    return res
      .status(200)
      .json(CustomResponse('Password updated successfully. You may login'));
  }

} //end class UserController

module.exports = new UserController();

/*
exports.userRegistration = async (request, response) => {
  // Register as guest
  const { email } = request.body;

  // Check if user email is taken in DB
  let user = await User.findOne({ email });

  if (user) {
    throw new CustomError('Email address already in use', 403);
  }

  user = new User({ ...request.body });
  user = await user.save();

  // Send a confirmation link to email
  const mailStatus = await createVerificationLink(user, request);
  // console.log(mailStatus);
  const { code, message, verificationUrl } = mailStatus;

  return response.status(code).json(CustomResponse(message));
};

exports.userLogin = async (request, response) => {
  // Login as guest
  const { email, password } = request.body;

  let user = await User.findOne({ email });

  const setFails = async (user, val) => {
    user.failedAttempts.count = val;
    user.failedAttempts.lastAttempt = Date.now();
    return user.save();
  };
  
  //  * This checks if the user has
  //  * tried and failed to login
  //  * more than thrice. If true,
  //  * it checks the last time the
  //  * user logged in, if it's less
  //  * than a day ago, it stops the user.
   
  if (user.failedAttempts && user.failedAttempts.count > 3) {
    let time = new Date(user.failedAttempts.lastAttempt);
    time = time.getTime() + 1000 * 60 * 60 * 24;
    if (time > Date.now()) {
      throw new CustomError('You have tried logging in too many times', 401);
    } else if (time < Date.now()) {
      user = await setFails(user, 0);
    }
  }

  // check if user exists in DB or if password provided by user doesn't match user password in DB
  if (!user || !(await user.matchPasswords(password))) {
    user = await setFails(user, user.failedAttempts.count + 1);
    throw new CustomError('Invalid email or password', 401);
  }


  if(user.active === 0){
    throw new CustomError('This account has been deactivated. Contact an admin', 401);
  }
  
  user = await setFails(user, 0);
  user = user.toJSON();

  // check if user has unverified email
  if (!user.isEmailVerified) {
    throw new CustomError('Please verify your email to proceed', 401);
  }
  SessionMgt.login(request, user);

  response.status(200).json(CustomResponse('Login successful', user));
};

exports.userForgotPassword = async (request, response) => {
  const { email } = request.body;
  // const buffer = crypto.randomBytes(32);
  // const token = buffer.toString();

  const RandomString = require('randomstring');
  const token = RandomString.generate(64);
  const expirationTime = Date.now() + 3600000; // 1 hour
  const user = await User.findOneAndUpdate(
    {
      email,
    },
    {
      resetPasswordToken: token,
      resetPasswordExpire: expirationTime,
    },
    {
      new: true,
    }
  );
  if (!user) {
    throw new CustomError(
      `Sorry a User Account with Email: ${email} doesn't exist on this service`,
      404
    );
  }

  const resetUrl = `http:\/\/${request.headers.host}\/api\/auth\/user\/password\/${token}`;
  sendForgotPasswordMail(user.email, user.username, resetUrl);

  return response
    .status(200)
    .json(
      CustomResponse(`A password reset link has been sent to ${user.email}`)
    );
};

exports.userResetPassword = async (request, response) => {
  const { token } = request.params;
  const { password } = request.body;
  const user = await User.findOneAndUpdate(
    {
      resetPasswordToken: token,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    },
    {
      password,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new CustomError(
      'Password reset token is invalid or has expired.',
      422
    );
  }

  await user.save();

  return response
    .status(200)
    .json(CustomResponse('Password updated successfully. You may login'));
};
*/

exports.authorizeUser = async (request, response, next) => {
  // This middleware authorizes users by checking if valid API_KEY is sent with the request

  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedUser = jwt.verify(token, JWT_ADMIN_SECRET);

    if (!decodedUser.id) {
      return response.status(403).json({ error: 'Invalid API_KEY' });
    }
    // TODO: link users using admin access token, use kaseem's auth middleware
    // TODO: if user has unverified email refer them to email verificaton; use sessions maybe
    // request.adminUser = decodedUser;
  } else {
    return response.status(401).send('Access denied. No token provided.');
  }

  next();
};
