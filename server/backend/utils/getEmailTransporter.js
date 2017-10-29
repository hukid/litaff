const nodemailer = require('nodemailer');

module.exports = () => {
  // const sender = 'ycxw6cd767fqcfon@ethereal.email';
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   auth: {
  //     user: 'ycxw6cd767fqcfon@ethereal.email',
  //     pass: 'nrxAMvtxMcJfrtJXtq',
  //   },
  // });

  const sender = 'truelight_seattle@outlook.com';
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: '587',
    auth: {
      user: 'apikey',
      pass: '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',
    },
    secure: false,
  });

  // const sender = 'seattletruelight@outlook.com';
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp-mail.outlook.com',
  //   port: '587',
  //   auth: {
  //     user: sender,
  //     pass: 'YR>Ff1]f2Lwa',
  //   },
  //   secure: false,
  // });

  transporter.sender = sender;
  return transporter;
};
