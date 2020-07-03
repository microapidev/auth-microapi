/**=================================================================
 * ====   TITLE::     ADDING USER FORGOT AND RESET PASSWORD    ====  
 * ====   AUTHOR:: jimoh19 <jemohkunle2007@gmail.com>           ====
 * ====   DATE::            1ST JULY 2020                      ====
 * =================================================================
 */

const User = require('../models/user');
const crypto = require('crypto');
const CustomError = require('../utils/CustomError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../utils/config');
const { sendForgotPasswordMail } = require('../EmailFactory/index');


exports.userForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const buffer = crypto.randomBytes(32);
    const token = buffer.toString();
    const expirationTime = Date.now() + 3600000; // 1 hour
    const user = await User.findOneAndUpdate(
      {
        email
      },
      {
        resetPasswordToken: token,
        resetPasswordExpire: expirationTime
      },
      {
        new: true
      }
    );
    if (!user){
      throw new CustomError(
        `Sorry a User Account with Email: ${email} doesn't exist on this service`, 
        404,
      );
    }

    const resetUrl = `http:\/\/${req.headers.host}\/api\/auth\/reset-password\/${token}`;
    sendForgotPasswordMail(user.email, user.username, resetUrl);

    return res.status(200).json({
      status: '200 Success',
      message: `A password reset link has been sent to ${user.email}`
    });
  } catch (error) {
    console.log('error from user forgot password >>>> ', error);
    return res.status(500).json({
      status: '500 Error',
      message: 'Something went wrong. Please Try again.',
    });
  }
};

exports.userResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOneAndUpdate(
      { 
        resetPasswordToken: token, 
        resetPasswordExpire: { 
          $gt: Date.now() 
        }
      },
      {
        password,
        resetPasswordToken: null,
        resetPasswordExpire: null
      },
      {
        new: true
      }
    );
    if (!user) {
      throw new CustomError(
        'Password reset token is invalid or has expired.',
        422,
      );
    }
    
    return res.status(200).json({
      status: '200 OK',
      message: 'Password updated successfully. You may login'
    });     
  } catch (error) {
    console.log('Error from user reset password >>>> ', error);
    return res.status(500).json({
      status: '500 Error',
      message: 'Something went wrong. Please Try again.',
    });
  }
};

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