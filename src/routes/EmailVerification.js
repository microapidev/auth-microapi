/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF EMAIL VERIFICATION ROUTE    ====  
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            28TH JUNE 2020                      ====
 * =================================================================
 */

const router = require('express').Router();
const EmailVerCtrl = require('../controllers/EmailVerification');

module.exports = () => {
  router.get('/verification/:token', EmailVerCtrl.verifyEmail);
  router.get('/resend/verification', EmailVerCtrl.resendVerification);
  return router;
};