const passport = require('passport');
const Task = require('../models/task');
const handleError = require('../utils/handleError');
const sendScheduleNotification = require('../utils/sendScheduleNotification');
const authorizeWithProjectId = require('../utils/authorization').authorizeWithProjectId;
const handleAuthorizationError = require('../utils/authorization').handleAuthorizationError;
const logger = require('../../logger');

function isValidDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
}

module.exports = (router) => {
  // define tasks rest APIs
  // define tasks rest APIs
  router.get('/tasks/:projectId/:startTime/:endTime', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;
    const startTime = new Date(req.params.startTime);
    const endTime = new Date(req.params.endTime);

    if (!authorizeWithProjectId(req.user, projectId)) {
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    if (!isValidDate(startTime) || !isValidDate(endTime)) {
      handleError(res, 'invalid time parameter');
      return;
    }

    Task.find({ projectId, 'time.start': { $gt: startTime, $lt: endTime } }, null, { sort: 'time.start' }, (err, tasks) => {
      if (err) {
        handleError(res, err);
        return;
      }

      res.json(tasks);
    });
  });

  router.post('/tasks/:projectId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;
    const task = req.body;

    if (!authorizeWithProjectId(req.user, projectId)) {
      handleError(res, 'you do not have permission');
      return;
    }

    if (task.subject
      && task.startTime
      && task.endTime
      && task.coworkers) {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);

      if (isValidDate(startTime) && isValidDate(endTime) && startTime.getTime() < endTime.getTime()) {
        const newTask = new Task();
        newTask.subject = task.subject;
        newTask.projectId = projectId;
        newTask.taskType = 1;
        newTask.time = {
          start: startTime,
          end: endTime,
          allday: false,
          timeType: 1,
        };
        newTask.content = task.content;
        newTask.category = task.category;
        newTask.asFree = false;
        newTask.reminder = {
          time: startTime,
          sendStatus: 0,
        };
        newTask.updateSequence = 0;
        newTask.resources = [];

        task.coworkers.forEach((coworker) => {
          newTask.resources.push({ id: coworker.id, resourceType: coworker.resourceType, name: coworker.name });
        });

        newTask.save((saveErr) => {
          if (saveErr) {
            handleError(res, saveErr);
            return;
          }

          res.json({ message: 'OK' });

          // post process to send notification if neccessary
          if (newTask.taskType === 1) {
            // send a schedule email for schedule task
            sendScheduleNotification(newTask, 1);
          }
        });
      }
    } else {
      handleError(res, 'Not a valid task');
    }
  });

  router.put('/tasks/:projectId/:taskId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const updatedTask = req.body;

    if (!authorizeWithProjectId(req.user, projectId)) {
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    if (updatedTask.subject
      && updatedTask.startTime
      && updatedTask.endTime
      && updatedTask.coworkers) {
      const startTime = new Date(updatedTask.startTime);
      const endTime = new Date(updatedTask.endTime);

      if (isValidDate(startTime) && isValidDate(endTime) && startTime.getTime() < endTime.getTime()) {
        Task.findOne({ _id: taskId }, (err, result) => {
          if (err) {
            handleError(res, err);
            return;
          } else if (result == null) {
            handleError(res, 'failed to find the task');
            return;
          }

          const originalTask = result;
          originalTask.subject = updatedTask.subject;
          originalTask.projectId = projectId;
          originalTask.taskType = 1;
          originalTask.time = {
            start: startTime,
            end: endTime,
            allday: false,
            timeType: 1,
          };
          originalTask.content = updatedTask.content;
          originalTask.category = updatedTask.category;
          originalTask.asFree = false;
          originalTask.reminder = {
            time: startTime,
            sendStatus: 0,
          };
          originalTask.resources = [];
          originalTask.updateSequence += 1;

          updatedTask.coworkers.forEach((coworker) => {
            originalTask.resources.push({ id: coworker.id, resourceType: coworker.resourceType, name: coworker.name });
          });

          originalTask.save((saveErr) => {
            logger.info(`saving ${originalTask.toString()}`);
            if (saveErr) {
              handleError(res, saveErr);
              return;
            }

            res.json({ message: 'OK' });
            // post process to send notification if neccessary
            if (originalTask.taskType === 1) {
              // send a schedule email for schedule task
              sendScheduleNotification(originalTask, 2);
            }
          });
        });
      } else {
        handleError(res, 'Not a valid task time');
      }
    } else {
      handleError(res, 'Not a valid task');
    }
  });

  router.delete('/tasks/:projectId/:taskId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    if (!authorizeWithProjectId(req.user, projectId)) {
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    const promise = Task.findByIdAndRemove(taskId).exec();
    promise.then((task) => {
      logger.info(`Task ${task.id} is deleted`);
      res.json({ message: 'OK' });
    })
    .catch((error) => {
      handleError(res, error);
    });
  });
};
