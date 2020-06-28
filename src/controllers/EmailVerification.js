/**=====================================================================
 * ====   TITLE:: IMPLEMENTATION OF EMAIL VERIFICATION CONTROLLER   ====  
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>      ====
 * ====   DATE::            28TH JUNE 2020                          ====
 * =====================================================================
 */

const EmailVerService = require('../services/EmailVerification');
const response = require('../utils/response');

class EmailVerification{

  async verifyEmail(req, res){

    const data = await EmailVerService.verifyEmail(req);

    return res.status(200).send(response('Email Address Verified', data));

  }

  async resendVerification(req, res){
    console.log(req);

    response.status(404).send(response('Stil working on it...', {}));

  }

}

module.exports = new EmailVerification();
