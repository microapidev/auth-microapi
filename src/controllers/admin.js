/**=================================================================
 * ====   TITLE::     ADDING ADMIN FORGOT AND RESET PASSWORD    ====  
 * ====   AUTHOR:: jimoh19 <jemohkunle2007@gmail.com>           ====
 * ====   DATE::            30TH JUNE 2020                      ====
 * =================================================================
 */

const Admin = require('../models/admin');
const crypto = require('crypto');
const CustomError = require('../utils/CustomError');
const bcrypt = require('bcrypt');
const { sendForgotPasswordMail } = require('../EmailFactory/index');

exports.adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const buffer = crypto.randomBytes(32);
    const token = buffer.toString();
    const expirationTime = Date.now() + 3600000; // 1 hour
    const admin = await Admin.findOneAndUpdate(
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
    if (!admin){
      throw new CustomError(
        `Sorry an Account with Email: ${email} doesn't exist on this service`, 
        404,
      );
    }

    const resetUrl = `http:\/\/${req.headers.host}\/api\/admin\/auth\/reset-password\/${token}`;
    sendForgotPasswordMail(admin.email, admin.username, resetUrl);

    return res.status(200).json({
      status: '200 Success',
      message: `A password reset link has been sent to ${admin.email}`
    });
  } catch (error) {
    console.log('error from admin user forgot password >>>> ', error);
    return res.status(500).json({
      status: '500 Error',
      message: 'Something went wrong. Please Try again.',
    });
  }
};

exports.adminResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const admin = await Admin.findOneAndUpdate(
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
    if (!admin) {
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
    console.log('Error from admin user reset password >>>> ', error);
    return res.status(500).json({
      status: '500 Error',
      message: 'Something went wrong. Please Try again.',
    });
  }
};