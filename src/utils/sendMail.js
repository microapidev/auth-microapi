const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  auth: {
    user: process.env.AUTH_EMAIL_ADDRESS,
    pass: process.env.AUTH_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = (from, to, subject, msg) => {
  const mailOptions = {
    from,
    to,
    subject,
    text: msg,
    html: msg, 
  };
  try {
    transporter.sendMail(mailOptions);
  } catch(err) {
    console.log('Error from sending mail >>> ', err);
  }
};