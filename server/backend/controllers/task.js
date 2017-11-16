const passport = require('passport');
const Task = require('../models/task');
const Resource = require('../models/resource');
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
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    if (task.subject
      && task.startTime
      && task.endTime
      && task.reminderTime
      && task.coworkers) {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);
      const reminderTime = new Date(task.reminderTime);

      if (isValidDate(startTime) && isValidDate(endTime) && startTime.getTime() < endTime.getTime()
          && isValidDate(reminderTime) && reminderTime.getTime() < startTime.getTime()) {
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
          time: reminderTime,
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
      && updatedTask.reminderTime
      && updatedTask.coworkers) {
      const startTime = new Date(updatedTask.startTime);
      const endTime = new Date(updatedTask.endTime);
      const reminderTime = new Date(updatedTask.reminderTime);

      if (isValidDate(startTime) && isValidDate(endTime) && startTime.getTime() < endTime.getTime()
          && isValidDate(reminderTime) && reminderTime.getTime() < startTime.getTime()) {
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
          if (originalTask.reminder.time.getTime() !== reminderTime.getTime()) {
            originalTask.reminder = {
              time: reminderTime,
              sendStatus: 0,
            };
          }
          originalTask.updateSequence += 1;

          const newResources = updatedTask.coworkers.map((coworker) => ({ id: coworker.id, resourceType: coworker.resourceType, name: coworker.name }));

          const removedResources = getRemovedResources(originalTask.resources, newResources);
          originalTask.resources = newResources;

          originalTask.save((saveErr) => {
            logger.info(`saving ${originalTask.toString()}`);
            if (saveErr) {
              handleError(res, saveErr);
              return;
            }

            res.json({ message: 'OK' });
            // post process to send notification if neccessary
            // TODO: Only send schedule update when needed, for example reminder update shouldn't trigger new notification
            if (originalTask.taskType === 1) {
              // TODO: optimize this process to reduce db queries, we should refactor to combine two calls
              // send a schedule email for schedule task
              sendScheduleNotification(originalTask, 2);

              // send cancel event to the resources that are removed
              if (removedResources.length > 0) {
                const resourceIds = removedResources.map((resource) => resource.id);
                const resourcePromise = Resource.find({ _id: { $in: resourceIds } }).exec();
                resourcePromise
                .then((resources) => {
                  const toList = resources
                    .filter((resource) => resource.contacts && resource.contacts.length > 0 && resource.contacts[0].contactType === 1)
                    .map((resource) => `${resource.name} <${resource.contacts[0].value}>`);
                  setTimeout(() => sendScheduleNotification(originalTask, 3, toList), 2000);
                })
                .catch((findResourceErr) => {
                  logger.error(findResourceErr);
                });
              }
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
    promise.then((deletedTask) => {
      logger.info(`Task ${deletedTask.id} is deleted`);
      res.json({ message: 'OK' });
      if (deletedTask.taskType === 1) {
        // TODO: optimize this process to reduce db queries, we should refactor to combine two calls
        // send a schedule email for schedule task
        sendScheduleNotification(deletedTask, 3);
      }
    })
    .catch((error) => {
      handleError(res, error);
    });
  });
};

function getRemovedResources(originalResources, newResources) {
  const newResourceDict = {};
  newResources.forEach((resource) => {
    newResourceDict[resource.id] = true;
  });

  const removedResources = [];
  originalResources.forEach((origResource) => {
    if (!newResourceDict[origResource.id]) {
      removedResources.push(origResource);
    }
  });

  return removedResources;
}
