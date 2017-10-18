const Resource = require('../models/resource');
const logger = require('../../logger');
const getEmailTransporter = require('./getEmailTransporter');
const ical = require('ical-generator');

// TODO: add a cache for resources
// let resourcesCache = null;
// let lastCacheTime = new Date(0);

// notificationType: 1 - create; 2 - update; 3 - delete
module.exports = (task, notificationType, toList) => {
  const resourceIds = task.resources.map((resource) => resource.id);
  const resourcePromise = Resource.find({ _id: { $in: resourceIds } }).exec();
  resourcePromise
    .then((resources) => {
      const attendees = resources
        .filter((resource) => resource.contacts && resource.contacts.length > 0 && resource.contacts[0].contactType === 1)
        .map((resource) => `${resource.name} <${resource.contacts[0].value}>`);
      if (toList) {
        sendEmailNotification(task, attendees, notificationType, toList);
      } else {
        sendEmailNotification(task, attendees, notificationType, attendees);
      }
    })
    .catch((err) => {
      logger.error(err);
    });
};

function sendEmailNotification(task, attendees, notificationType, toList) {
  if (!toList || toList.length === 0) {
    logger.info(`no email resources for task: ${task.id}`);
    return;
  }

  const transporter = getEmailTransporter();
  const calendar = ical({
    domain: 'litaff.com',
    name: 'litaff calendar',
  });

  const method = notificationType === 3 ? 'cancel' : 'request';
  const adjustedSequence = notificationType === 3 ? task.updateSequence + 1 : task.updateSequence;
  const formattedSubject = `${notificationType === 3 ? '[Canceled] ' : ''}${task.subject}`;

  // conduct ical event
  calendar.createEvent({
    start: task.time.start,
    end: task.time.end,
    summary: formattedSubject,
    description: task.content,
    method,
    attendees: toList,
    organizer: { email: transporter.sender, name: 'litaff' },
    uid: task.id.toString(),
    sequence: adjustedSequence,
  });

  const content = calendar.toString();
  // calendar clear will remove domain as well
  calendar.clear();
  const toString = toList.join(',');
  const mailOptions = {
    from: transporter.sender, // sender address
    to: toString, // list of receivers
    subject: formattedSubject, // Subject line
    text: `${task.content}`,
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

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      logger.error(error);
      return;
    }
    logger.info(`sent schedule for task: ${task.id}`);
  });
}
