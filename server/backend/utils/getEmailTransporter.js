const nodemailer = require('nodemailer');

module.exports = () => {
  const sender = 'ycxw6cd767fqcfon@ethereal.email';
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ycxw6cd767fqcfon@ethereal.email',
      pass: 'nrxAMvtxMcJfrtJXtq',
    },
  });

  // const sender = 'seattletruelight@outlook.com';
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp-mail.outlook.com',
  //   port: '587',
  //   auth: {
  //     user: sender,
  //     pass: 'YR>Ff1]f2Lwa',
  //   },
  //   secureConnection: true,
  //   tls: { ciphers: 'SSLv3' },
  // });

  transporter.sender = sender;
  return transporter;
};
