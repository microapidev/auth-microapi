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

    // add callback url and redirect
    if (data.isVerified) {
      res.redirect(decodeURIComponent(data.emailVerifyCallbackUrl));
    }
  }

  async resendVerification(req, res) {
    const data = await EmailVerService.resendVerificationEmail(req);
    return res.status(200).send(response("New Verification Link Sent.", data));
  }
}
module.exports = new EmailVerification();
