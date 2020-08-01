/**=================================================================
 * ====   TITLE::     DESIGN OF EMAIL VERIFICATION MODEL        ====  
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            27TH JUNE 2020                      ====
 * =================================================================
 */

const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({

  token: {
    type: String, 
    required: true
  },

  createdAt: {
    type: Date, 
    required: true, 
    default: Date.now, 
    expires: 3600
  },

  _userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user"
  }
});

module.exports = mongoose.model("EmailVerificationToken", emailVerificationSchema);