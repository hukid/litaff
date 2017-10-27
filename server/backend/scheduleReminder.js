const schedule = require('node-schedule');
const moment = require('moment');

const Task = require('./models/task');
const Resource = require('./models/resource');
const logger = require('../logger');
const getEmailTransporter = require('./utils/getEmailTransporter');

module.exports = () => {
  // every 10 minutes
  schedule.scheduleJob('*/10 * * * *', () => {
  // schedule.scheduleJob('*/30 * * * * *', () => {
    // The time is set to 10 minutes before or after
    const startTime = new Date(Date.now() - (10 * 60 * 1000));
    const endTime = new Date(Date.now() + (10 * 60 * 1000));
    const contactDict = {};

    const promise = Task.find({ 'reminder.sendStatus': 0, 'reminder.time': { $gt: startTime, $lt: endTime } }).exec();
    promise
    .then((tasks) => {
      if (tasks == null || tasks.length === 0) {
        logger.info('no tasks need reminder');
        return;
      }

      const resourcePromises = [];
      tasks.forEach((task) => {
        const remindingTask = task;
        if (!remindingTask.resources || remindingTask.resources.length === 0) {
          // TODO: save status or update query to avoid such task to be returned
          return;
        }

        const projectIdKey = remindingTask.projectId.toString();
        if (!contactDict[projectIdKey]) {
          logger.info(`building contact dictionary for ${projectIdKey}`);
          const resourcePromise = Resource.find({ projectId: projectIdKey }).exec();
          // resourcePromises.push(resourcePromise);
          contactDict[projectIdKey] = {};
          const thenPromise = resourcePromise.then((resources) => {
            // cache the resources
            resources.forEach((resource) => {
              if (resource.contacts.length > 0 && resource.contacts[0].contactType === 1) {
                // TODO: so far only take the first contact and it has to be email type, need update later once it supports more contact types
                contactDict[projectIdKey][resource.id] = resource.contacts[0].value;
              }
            });
          })
          .catch((findResourceErr) => {
            handleError(findResourceErr);
          });

          resourcePromises.push(thenPromise);
        }
      });

      Promise.all(resourcePromises)
      .then(() => {
        tasks.forEach((task, index) => {
          const projectIdKey = task.projectId.toString();
          if (contactDict[projectIdKey]) {
            sendReminderEmail(task, index, contactDict[projectIdKey]);
          }
        });
      });
    })
    .catch((err) => {
      handleError(err);
    });
  });
};

function sendReminderEmail(task, index, contactMapping) {
  const transporter = getEmailTransporter();
  const contacts = task.resources.map((resource) => contactMapping[resource.id]);
  const filteredContacts = contacts.filter((contact) => !!contact);

  if (filteredContacts.length === 0) {
    logger.info(`Skip sending reminder due to empty contacts, task id is ${task.id}`);
    return;
  }

  const toList = filteredContacts.join(',');
  const startMoment = moment(task.time.start);
  const formattedSubject = `Upcoming(${startMoment.fromNow()}): ${task.subject}`;

  const mailOptions = {
    from: transporter.sender, // sender address
    to: toList, // list of receivers
    subject: formattedSubject, // Subject line
    text: task.content, // plain text body
  };

  setTimeout(() => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        handleError(error);
        return;
      }
      logger.info(`sending message ${task.id}`);
      // mark the task as reminded
      const updatingTask = task;
      updatingTask.reminder.sendStatus = 1;
      updatingTask.save((saveErr) => {
        if (saveErr) {
          handleError(saveErr);
          return;
        }
        logger.info(`sent a reminder for task - ${JSON.stringify(updatingTask)}`);
      });
    });
  }, 1000 * index);
}

function handleError(error) {
  logger.error(error);
}
