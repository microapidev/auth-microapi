const RandomString = require('randomstring');
const User = require('../models/user');
const SessionMgt = require('../services/SessionManagement');
const {createVerificationLink} = require('../utils/EmailVerification');
const { CustomError } = require('../utils/CustomError');
const {sendForgotPasswordMail} = require('../EmailFactory');


class UserService{

  async register(req){
    // Register as guest
    const { email } = req.body;
  
    // Check if user email is taken in DB
    let user = await User.findOne({ email });
  
    if (user) {
      throw new CustomError('Email address already in use', 403);
    }
  
    user = new User({ ...req.body });
    user = await user.save();
  
    // Send a confirmation link to email
    const mailStatus = await createVerificationLink(user, req);
    // console.log(mailStatus);

    return {
      user: user,
      status: mailStatus.status,
      message: mailStatus.message,
      code: mailStatus.code
    };
  }

  async login(req){
    // Login as guest
    const { email, password } = req.body;
  
    let user = await User.findOne({ email });
  
    const setFails = async (user, val) => {
      user.failedAttempts.count = val;
      user.failedAttempts.lastAttempt = Date.now();
      return user.save();
    };
    /**
     * This checks if the user has
     * tried and failed to login
     * more than thrice. If true,
     * it checks the last time the
     * user logged in, if it's less
     * than a day ago, it stops the user.
     */
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

    return {
      user: user
    };
  
  } //end login

  async forgotPassword(req){    
    
    const { email } = req.body;
    // const buffer = crypto.randomBytes(32);
    // const token = buffer.toString();
    
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
    
    const resetUrl = `http:\/\/${req.headers.host}\/api\/auth\/user\/password\/${token}`;
    sendForgotPasswordMail(user.email, user.username, resetUrl);

    return {
      url: resetUrl,
      user: user
    };

  } //end forgotPass

  async resetPassword(req){
    const { token } = req.params;
    const { password } = req.body;
    
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
  
    return {
      user: user
    };

  }
}

module.exports = new UserService();