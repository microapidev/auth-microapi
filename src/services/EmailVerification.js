/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF EMAIL VERIFICATION SERVICE  ====  
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            28TH JUNE 2020                      ====
 * =================================================================
 */

const EmailVerification = require('../models/EmailVerification');
const {User} = require('../models/user');
const CustomError = require('../utils/CustomError');

class EmailVerificationService{

  async verifyEmail(params){
    // Collect the token from the URL and query for it
    let token = await EmailVerification.findOne({token: params.token});
    this.logger('Here is the token: '+token);
    if(!token){
      throw new CustomError('Verification Link Invalid/Expired', 404);
    }
    
    // Now update the user profile and return updated data 
    let userData = await User.findByIdAndUpdate(token._userId, 
      {$set: {isEmailVerified: true}}, 
      {new: true});

    this.logger(userData);
    if(!userData)
    {throw new CustomError('User Could Not Be Updated', 401);}

    return {
      isVerified: userData.isEmailVerified
    };
    
  }

  // ================
  logger(msg){
    let debug = false;
    if(debug){
      console.log('==========MailService==LOGGER============');
      console.log(msg);
    }
      
  }

}

module.exports = new EmailVerificationService();