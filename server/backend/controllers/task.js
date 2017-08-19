const Task = require('../models/task');
const handleError = require('../utils/handleError');

function isValidDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
}

module.exports = (router) => {
  // define tasks rest APIs
  // define tasks rest APIs
  router.get('/tasks/:projectId/:startTime/:endTime', (req, res) => {
    const projectId = req.params.projectId;
    const startTime = new Date(req.params.startTime);
    const endTime = new Date(req.params.endTime);

    if (!isValidDate(startTime) || !isValidDate(endTime)) {
      handleError(res, 'invalid time parameter');
      return;
    }

    Task.find({ projectid: projectId, 'time.start': { $gt: startTime, $lt: endTime } }, (err, tasks) => {
      if (err) {
        handleError(res, err);
        return;
      }

      res.json(tasks);
    });
  });

  router.post('/tasks/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const task = req.body;

    if (task.subject
      && task.startTime
      && task.endTime
      && task.coworkers) {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);

      if (isValidDate(startTime) && isValidDate(endTime) && startTime.getTime() < endTime.getTime()) {
        const newTask = new Task();
        newTask.subject = task.subject;
        newTask.projectid = projectId;
        newTask.taskType = 1;
        newTask.time = {
          start: startTime,
          end: endTime,
          allday: false,
          timeType: 1,
        };
        newTask.content = task.content;
        newTask.category = task.category;
        newTask.asfree = false;
        newTask.resources = [];
        newTask.reminderSent = false;

        task.coworkers.forEach((coworker) => {
          newTask.resources.push({ id: coworker.id, resourceType: coworker.resourceType, name: coworker.name });
        });

        newTask.save((saveErr) => {
          if (saveErr) {
            handleError(res, saveErr);
            return;
          }

          res.json({ message: 'OK' });
        });
      }
    } else {
      handleError(res, 'Not a valid task');
    }
  });

  router.put('/tasks/:projectId/:taskId', (req, res) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const updatedTask = req.body;

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
          originalTask.projectid = projectId;
          originalTask.taskType = 1;
          originalTask.time = {
            start: startTime,
            end: endTime,
            allday: false,
            timeType: 1,
          };
          originalTask.content = updatedTask.content;
          originalTask.category = updatedTask.category;
          originalTask.asfree = false;
          originalTask.resources = [];

          updatedTask.coworkers.forEach((coworker) => {
            originalTask.resources.push({ id: coworker.id, resourceType: coworker.resourceType, name: coworker.name });
          });

          originalTask.save((saveErr) => {
            console.log('saving' + originalTask.toString());
            if (saveErr) {
              handleError(res, saveErr);
              return;
            }

            res.json({ message: 'OK' });
          });
        });
      } else {
        handleError(res, 'Not a valid task time');
      }
    } else {
      handleError(res, 'Not a valid task');
    }
  });

  router.delete('/tasks/:projectId/:taskId', (req, res) => {
    res.send('delete tasks is called');
  });
};
