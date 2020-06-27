/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF EMAIL VERIFICATION LOGIC    ====  
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            27TH JUNE 2020                      ====
 * =================================================================
 */

const RandomString = require('randomstring');
const User = require('../models/user');
const EmailVerification = require('../models/EmailVerification');
const EmailFactory = require('../EmailFactory');
const CustomError = require('../utils/CustomError');

const {sendVerificationMail} = EmailFactory;

class EmailVerificationUtil{
   
  constructor(){
    
  }

  /**
   * Upon signing up, collect the user data
   * Create a verification token using random string
   * Package the token as URL
   * Send the token to user email address provided
   */

  async createVerificationLink(user, req) {

    let data = {
      token: RandomString.generate(64),
      _userId: user.uid
    };

    if(!await EmailVerification.create(data)){
      let deletedUser = User.deleteOne({email: user.email});
      this.logger(deletedUser);
      throw new CustomError('Failed to generate token. Try signup again', 403);
    }

    let verificationUrl = 'http:\/\/' + req.headers.host + '\/api\\/auth\/email\/verification\/' + data.token;
    
    //Now send the mail to the user (expires after 2mins)
    if(!await sendVerificationMail(user.email, verificationUrl)){
      throw new CustomError('Email Could not be Sent. Try Again.');
    }    
      
    this.logger('Sending mail...');
    return{
      message: 'Check Your Mailbox for Link',
      status: 'success',
      code: 200
    };
  }

  // handles all log
  logger(msg) {
    let debug = false;
    if(debug){
      console.log('============MailUtil==LOGGER=======');
      console.log(msg);
    }
      
  }

}

module.exports = new EmailVerificationUtil();