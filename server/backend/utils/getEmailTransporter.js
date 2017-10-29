const nodemailer = require('nodemailer');

module.exports = () => {
  const sender = 'truelight_seattle@outlook.com';
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: '587',
    auth: {
      user: 'apikey',
      pass: process.env.MAIL_KEY,
    },
    secure: false,
  });

  transporter.sender = sender;
  return transporter;
};
