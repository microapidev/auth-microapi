const { User } = require('../models/user');
const crypto = require('crypto');
const sendMail = require('../utils/sendMail');
const bcrypt = require('bcrypt');

exports.adminForgotPassword = async (req, res) => {
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
      return res.status(404).json({
        status: '404 Error',
        message: `Sorry an Account with Email: ${email} doesn't exist on this service`
      });
    }
    const resetUrl = `http://${req.headers.host}/api/auth/admin/reset-password/${token}`;
    sendMail(
      'no-reply@microapi.com',
      user.email,
      'PASSWORD RESET',
      `   
        <p>Hello ${user.name}, </p>
        <p>There was a request to reset your password</p>
        <p>Please click on the button below to get a new password</p>
        <a href='${resetUrl}'><button>Reset Password</button></a>
        <br>
        <p>If you did not make this request, just ignore this mail as nothing has changed.</p>
        <br>
        <br>
        <p>Best Regards, <b><span style="color: red;">Auth-Api</span></b>Team</p>
       `
    );
    return res.status(200).json({
      status: '200 Success',
      message: `A password reset link has been sent to ${user.email}`
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
    const hashedPw = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { 
        resetPasswordToken: token, 
        resetPasswordExpire: { 
          $gt: Date.now() 
        }
      },
      {
        password: hashedPw,
        resetPasswordToken: null,
        resetPasswordExpire: null
      },
      {
        new: true
      }
    );
    if (!user) {
      return res.status(422).json({
        status: '422 Error',
        message: 'Password reset token is invalid or has expired.'
      });
    }
    sendMail(
      'no-reply@microapi.com',
      user.email,
      'PASSWORD RESET SUCCESSFUL',
      `   
        <p>Hello ${user.name}, </p>
        <p>Your request to update your password was successful</p>
        <br>
        <br>
        <p>Best Regards, <b><span style="color: red;">Auth-Api</span></b>Team</p>
      `
    );
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