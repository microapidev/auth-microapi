/**=================================================================
 * ====   TITLE::     CONFIGURING EMAIL SMTP SERVER/PROTOCOL    ====
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            27TH JUNE 2020                      ====
 * =================================================================
 */

const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(process.env.SENDGRID_API_KEYS);

module.exports = {
  sendVerificationMail: (emailAddress, verifyLink) => {
    const msg = {
      to: emailAddress,
      from: "AUTH API <hngi7microapi@gmail.com>",
      subject: "CONFIRM YOUR EMAIL ADDRESS",
      html: `
        <div style="text-align: center;"><span style="font-family:verdana,geneva,sans-serif;">
          <p>
              Thank you for signing up on our platform. 
              <br>
              Kindly verify your email address.
          </p>
          <br>
          <p>
              <span><a href="${verifyLink}"> ${verifyLink}</a></span>
          </p>
          <br>
              We love you!
          <p></p>
          <br><br>
          <span>Regards,</span>
            <p><b>Team.</b></p>
          </span>
        </div>
        `,
    };
    console.log("===Sending Verification link now...");
    return new Promise((resolve, reject) => {
      sendGrid.send(msg).then(resolve).catch(reject);
    }).catch((err) => {
      console.log("Error in the mail code: " + err.message);
    });

    // return await sendGrid.send(msg);
  },

  sendForgotPasswordMail: (emailAddress, username, passwordLink) => {
    const msg = {
      to: emailAddress,
      from: "AUTH API <no-reply@authapi.com>",
      subject: "PASSWORD RESET",
      html: `
        <div style="text-align: center;"><span style="font-family:verdana,geneva,sans-serif;">
          <p>Hello ${username}, </p>
          <p>There was a request to reset your password</p>
          <p>Please click on the button below to get a new password</p>
          <a href='${passwordLink}'><button>Reset Password</button></a>
          <br>
          <p>If you did not make this request, just ignore this mail as nothing has changed.</p>
          <br>
          <br>
          <p>Best Regards, <b><span style="color: red;">Auth-Api</span></b>Team</p>
        `,
    };
    console.log("===Sending Password reset link now...");
    return new Promise((resolve, reject) => {
      sendGrid.send(msg).then(resolve).catch(reject);
    }).catch((err) => {
      console.log("Error in the mail code: " + err.message);
    });
  },
};
