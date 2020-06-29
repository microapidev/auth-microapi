/**=================================================================
 * ====   TITLE::     CONFIGURING EMAIL SMTP SERVER/PROTOCOL    ====  
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            27TH JUNE 2020                      ====
 * =================================================================
 */

const sendGrid = require('@sendgrid/mail');

sendGrid.setApiKey(process.env.SENDGRID_API_KEYS);

module.exports = {
  sendVerificationMail: (emailAddress, verifyLink) => {
    const msg = {
      to: emailAddress,
      from: 'AUTH API <no-reply@authapi.com>',
      subject: 'CONFIRM YOUR EMAIL ADDRESS',
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
        `
    };
    console.log('===Sending Verification link now...');
    return new Promise((resolve, reject)=>{
      sendGrid.send(msg).then(resolve).catch(reject);
    }).catch(err=>{console.log('Error in the mail code: '+err.message);});

    // return await sendGrid.send(msg);

  }
};
 