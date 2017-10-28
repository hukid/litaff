const nodemailer = require('nodemailer');

module.exports = () => {
  const sender = 'seattletruelight@outlook.com';
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: '587',
    auth: {
      user: sender,
      pass: 'YR>Ff1]f2Lwa',
    },
    secureConnection: false,
    tls: { ciphers: 'SSLv3' },
  });

  transporter.sender = sender;
  return transporter;
};
