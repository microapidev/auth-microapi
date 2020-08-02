/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF EMAIL VERIFICATION LOGIC    ====
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            27TH JUNE 2020                      ====
 * =================================================================
 */

const RandomString = require("randomstring");
const User = require("../models/user");
const EmailVerification = require("../models/EmailVerification");
const EmailFactory = require("../EmailFactory");
const { CustomError } = require("../utils/CustomError");

const { sendVerificationMail } = EmailFactory;

class EmailVerificationUtil {
  constructor() {}

  /**
   * Upon signing up, collect the user data
   * Create a verification token using random string
   * Package the token as URL
   * Send the token to user email address provided
   */

  async createVerificationLink(user, req) {
 
    let temp = req.body.emailVerifyCallbackUrl;
    
    if (temp.indexOf("%") < 0) {
      temp = encodeURIComponent(temp);
    }
    // console.log(req);
    let data = {
      token: RandomString.generate(64),
      _userId: user._id,
      emailVerifyCallbackUrl: temp,
    };

    if (!(await EmailVerification.create(data))) {
      let deletedUser = User.deleteOne({ email: user.email });
      // this.logger('DELETED USER', deletedUser);
      throw new CustomError("Failed to generate token. Try signup again", 403);
    }

    let verificationUrl =
      "http://" +
      req.headers.host +
      req.baseUrl +
      "/email-verification/" +
      data.token;
    console.log("URL", verificationUrl);
    //Now send the mail to the user (expires after 1hr)
    if (!(await sendVerificationMail(user.email, verificationUrl))) {
      throw new CustomError("Email Could not be Sent. Try Again.");
    }

    // this.logger('SUCCESS', 'Sending mail...');
    return {
      verificationUrl,
      message: "We sent you mail to confirm your email address",
      success: true,
      code: 200,
    };
  }

  // handles all log
  logger(title, msg) {
    let debug = false;
    if (debug) {
      console.log("============" + title + "==LOGGER=======");
      console.log(msg);
    }
  }
}

module.exports = new EmailVerificationUtil();
