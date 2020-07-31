/**=====================================================================
 * ====   TITLE:: IMPLEMENTATION OF EMAIL VERIFICATION CONTROLLER   ====
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>      ====
 * ====   DATE::            28TH JUNE 2020                          ====
 * =====================================================================
 */

const EmailVerService = require("../services/EmailVerification");
const response = require("../utils/response");

class EmailVerification {
  async verifyEmail(req, res) {
    const data = await EmailVerService.verifyEmail(req);

    // return res.status(200).send(response("Email Address Verified", data));
    //hardcoding call back url to redirect back to microapi site

    if (data) {
      return res.redirect("https://microapi.dev/accounts/signin");
    }
  }

  async resendVerification(req, res) {
    const data = await EmailVerService.resendVerificationEmail(req);
    return res.status(200).send(response("New Verification Link Sent.", data));
  }
}
module.exports = new EmailVerification();
