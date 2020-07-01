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