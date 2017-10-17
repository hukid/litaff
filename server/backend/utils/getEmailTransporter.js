const nodemailer = require('nodemailer');

module.exports = () => {
  const sender = 'seattletruelight@outlook.com';
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: sender,
      pass: 'YR>Ff1]f2Lwa',
    },
  });

  transporter.sender = sender;
  return transporter;
};
