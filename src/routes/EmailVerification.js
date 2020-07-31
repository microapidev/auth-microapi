/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF EMAIL VERIFICATION ROUTE    ====  
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            28TH JUNE 2020                      ====
 * =================================================================
 */

const router = require("express").Router();
const EmailVerCtrl = require("../controllers/EmailVerification");

module.exports = () => {
  router.get("/:token", EmailVerCtrl.verifyEmail);
  router.get("/resend", EmailVerCtrl.resendVerification);
  return router;
};