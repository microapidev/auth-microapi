const RandomString = require('randomstring');
const User = require('../models/user');
const SessionMgt = require('../services/SessionManagement');
const {createVerificationLink} = require('../utils/EmailVerification');
const { CustomError } = require('../utils/CustomError');
const {sendForgotPasswordMail} = require('../EmailFactory');
const { ACCOUNT_SID, AUTH_TOKEN, SERVICE_ID } = require('../utils/config');

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

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

      await user.save();
    };
    /**
     * This checks if the user has
     * tried and failed to login
     * more than thrice. If true,
     * it checks the last time the
     * user logged in, if it's less
     * than a day ago, it stops the user.
     */
    // if (user.failedAttempts && user.failedAttempts.count > 3) {
    //   let time = new Date(user.failedAttempts.lastAttempt);
    //   time = time.getTime() + 1000 * 60 * 60 * 24;
    //   if (time > Date.now()) {
    //     throw new CustomError('You have tried logging in too many times', 401);
    //   } else if (time < Date.now()) {
    //     user = await setFails(user, 0);
    //   }
    // }
  
    // check if user exists in DB or if password provided by user doesn't match user password in DB
    if (!user || !(await user.matchPasswords(password))) {
      // await setFails(user, user.failedAttempts.count + 1);
      throw new CustomError('Invalid email or password', 401);
    }
  
  
    if(user.active === 0){
      throw new CustomError('This account has been deactivated. Contact an admin', 401);
    }
    
    // user = await setFails(user, 0);
    user = user.toJSON();
  
    // check if user has unverified email
    if (!user.isEmailVerified) {
      throw new CustomError('Please verify your email to proceed', 401);
    }

    if(user.twoFactorAuth.is2FA === false) {
      SessionMgt.login(req, user);
      return {
        msg: 'Your account is not two factor authenticated',
        data: user
      };
    }

    if(user.twoFactorAuth.status === 'approved') {
      SessionMgt.login(req, user);
      return {
        msg: 'Your account is protected with 2FA',
        // data: user
        data: user.toJSON().id
      };
    }

    const userNumber = `+${234}` + user.phone_number.slice(1);

    // console.log(user)

    try {
      if(user.twoFactorAuth.is2FA === true) {
        const data = await client
          .verify
          .services(SERVICE_ID)
          .verifications
          .create({
            to: userNumber,
            channel: 'sms'
          });

        let user2FA = await User.findOne({ email });
  
        const set2FA = async (user, val) => {
          user.twoFactorAuth.is2FA = true;
          user.twoFactorAuth.status = val;
          return user.save();
        };

        user = await set2FA(user2FA, data.status);
        user = user.toJSON();

        SessionMgt.login(req, user);

        return {
          user: user,
        };
      } 
      // else {
      //   SessionMgt.login(req, user);
      //   return {
      //     msg: "enable 2FA to make your account fully protected",
      //     user: user
      //   }
      // }
    } catch(err) {
      if (err.status === 429 && err.code === 20492) {
        return {
          data: 'Too many request'
        };
      }
    } 
  } //end login

  async otpVerify(req) {

    // const user2FA = req.session.user;

    const { code, user2FA } = req.query;
    const phone = `+${234}` + user2FA.phone_number.slice(1);
    const email = user2FA.email;

    let user = await User.findOne({ email });

    if(user2FA.twoFactorAuth.status === 'approved' && user.twoFactorAuth.status === 'approved') {
      return {
        msg: 'Your account is two factor authenticated',
        data: user
      };
    }

    try{
      if(user2FA.twoFactorAuth.is2FA && user2FA.twoFactorAuth.status === 'pending' && code.length === 6) {
        const data = await client
          .verify
          .services(SERVICE_ID)
          .verificationChecks
          .create({
            to: phone,
            code: code
          });

        let user = await User.findOne({ email });

        const set2FA = async (user, val) => {
          user.twoFactorAuth.status = val;
          return user.save();
        };

        user = await set2FA(user, data.status);
        user2FA.twoFactorAuth.status = data.status;
        user = user.toJSON();
        return {
          message: 'OTP successfully verified',
          verify: data
        };
      } 
      return {
        data: data.valid
      };
    
    } catch (err) {
      if(err.status === 404 && err.code === 20404) {
        return {
          data: 'Invalid code/code expired'
        };
      } 
    }
  }

  async enable2FA(req) {
    const user = req.session.user;
    const email = user.email;

    let findUser = await User.findOne({ email });
    try{
      if(findUser.twoFactorAuth.is2FA === false) {
        const enable2FA = async (user, val) => {
          user.twoFactorAuth.is2FA = val;
          return user.save();
        };

        findUser = await enable2FA(findUser, true);
        user.twoFactorAuth.is2FA = true;
        findUser = findUser.toJSON();
        return {
          message: '2FA just enabled, now you can receive OTP and verify it',
          data: findUser
        };
      } 
      return {
        message: '2FA is enabled, your account is protected',
        data: findUser
      };
    
    } catch (err) {
      return {
        message: 'something wrong' + err
      };
    }
  }

  async activeUser(req) {
    const active = req.session.user;
    console.log(active);
    try{
      if(!active) {
        return {
          data: 'Please Login before you do that'
        }; 
      }
      if(active.twoFactorAuth.is2FA && active.twoFactorAuth.status === 'pending') {
        return {
          msg: 'Please verify your 2FA Auth',
          data: active
        };
      }
      if(active.twoFactorAuth.is2FA && active.twoFactorAuth.status === 'approved') {
        return {
          msg: 'Your account is highly protected with 2FA',
          data: active
        };
      }
      if(!active.twoFactorAuth.is2FA && active.twoFactorAuth.status === null) {
        return {
          msg: 'Here your credential but I highly recommend you enable 2FA auth',
          data: active
        };
      }
    } catch(err) {
      return {
        data: err
      };
    }
  }

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