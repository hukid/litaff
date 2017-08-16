const schedule = require('node-schedule');

const Task = require('./models/task');
const logger = require('../logger');

module.exports = () => {
  schedule.scheduleJob('*/1 * * * *', () => {
    const startTime = new Date();
    const endTime = new Date(Date.now() + (24 * 60 * 60 * 1000));
    Task.find({ reminderSent: false, 'time.start': { $gt: startTime, $lt: endTime } }, (err, tasks) => {
      if (err) {
        handleError(err);
      }

      if (tasks.length === 0) {
        logger.info('no tasks need reminder');
      }

      tasks.forEach((task) => {
        const remindedTask = task;
        // TODO: send the reminder
        logger.info(`sent a reminder for task - ${JSON.stringify(remindedTask)}`);

        // mark the task as reminded
        remindedTask.reminderSent = true;
        remindedTask.save((saveErr) => {
          if (saveErr) {
            handleError(saveErr);
          }
        });
      });
    });
  });
};

function handleError(error) {
  logger.error(error);
}
