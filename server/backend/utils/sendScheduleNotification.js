const Resource = require('../models/resource');
const logger = require('../../logger');
const nodemailer = require('nodemailer');
const ical = require('ical-generator');

// TODO: add a cache for resources
// let resourcesCache = null;
// let lastCacheTime = new Date(0);

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'seattletruelight@outlook.com',
    pass: 'YR>Ff1]f2Lwa',
  },
});

const calendar = ical({
  domain: 'gmail.com',
  name: 'litaff calendar',
});

module.exports = (task) => {
  const resourceIds = task.resources.map((resource) => resource.id);
  const resourcePromise = Resource.find({ _id: { $in: resourceIds } }).exec();
  resourcePromise
    .then((resources) => {
      const emailContacts = resources
      .filter((resource) => resource.contacts && resource.contacts.length > 0 && resource.contacts[0].contactType === 1)
      .map((resource) => resource.contacts[0].value);
      sendEmailNotification(task, emailContacts);
    })
    .catch((err) => {
      logger.error(err);
    });
};

function sendEmailNotification(task, emailContacts) {
  if (!emailContacts || emailContacts.length === 0) {
    logger.info(`no email resources for task: ${task.id}`);
    return;
  }

  const attendees = emailContacts.map((email) => ({ email }));

  // conduct ical event
  calendar.createEvent({
    start: task.time.start,
    end: task.time.end,
    summary: 'Example Event',
    description: 'It works ;)',
    method: 'request',
    attendees,
    organizer: { email: 'seattletruelight@outlook.com', name: 'litaff' },
  });

  const content = calendar.toString();
  calendar.clear();
  const toList = emailContacts.join(',');
  const mailOptions = {
    from: 'seattletruelight@outlook.com', // sender address
    to: toList, // list of receivers
    subject: 'A Test email from litaff', // Subject line
    html: `<h1>${task.subject}</j1>`, // plain text body
    // icalEvent: {
    //   // filename: 'schedule.ics',
    //   method: 'request',
    //   content,
    // },
    alternatives: [{
      contentType: 'text/calendar',
      content,
    }],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
      return;
    }
    logger.info(`sent schedule for task: ${task.id}`);
  });
}
