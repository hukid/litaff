/**
 * setupScheduleApi.js
 *
 * Define all the schedule api here
 *
 */

const mongoose = require('mongoose');
const logger = require('../logger');
const Tenant = require('./models/tenant');
const Project = require('./models/project');
const Task = require('./models/task');
const Resource = require('./models/resource');

module.exports = (router) => {
  const dbConnectionString = 'mongodb://localhost:27017/litaff';

  mongoose.Promise = global.Promise;
  mongoose.connect(dbConnectionString);

  const defaultTenantName = 'devTenant';
  const defaultProjectName = 'devProject';

  // The following methods is only used to initialize the dev environment
  router.get('/createDefaultTenant', (req, res) => {
    Tenant.findOne({ name: defaultTenantName }, (err, defaultTenant) => {
      if (defaultTenant == null) {
        const newDefaultTenant = new Tenant();
        newDefaultTenant.name = defaultTenantName;
        newDefaultTenant.save((saveError) => {
          if (saveError) {
            handleError(res, saveError);
            return;
          }

          res.json(newDefaultTenant);
        });
      } else {
        res.json({ message: 'default tenant has been created', data: defaultTenant });
      }
    });
  });

  router.get('/getDefaultTenant', (req, res) => {
    Tenant.findOne({ name: defaultTenantName }, (err, defaultTenant) => {
      if (err) {
        handleError(res, err);
        return;
      }

      res.json(defaultTenant);
    });
  });

  router.get('/createDefaultProject', (req, res) => {
    Tenant.findOne({ name: defaultProjectName }, (err, defaultProject) => {
      if (defaultProject == null) {
        const newDefaultProject = new Project();
        newDefaultProject.name = defaultProjectName;
        newDefaultProject.save((saveError) => {
          if (saveError) {
            handleError(res, saveError);
            return;
          }

          res.json(newDefaultProject);
        });
      } else {
        res.json({ message: 'default porject has been created', data: defaultProject });
      }
    });
  });

  router.get('/getDefaultProject', (req, res) => {
    Project.findOne({ name: defaultProjectName }, (err, defaultProject) => {
      if (err) {
        handleError(res, err);
        return;
      }

      res.json(defaultProject);
    });
  });

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

  // define resources rest API
  router.get('/resources/:projectId/:type?', (req, res) => {
    const projectId = req.params.projectId;

    Resource.find({ projectid: projectId }, (err, resources) => {
      if (err) {
        handleError(res, err);
        return;
      }

      res.json(resources);
    });
  });

  router.get('/resources/:projectId/:startTime/:endTime', (req, res) => {
    res.send('get available resources is called');
  });

  router.post('/resources/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const resourceInfo = req.body;

    Resource.findOne({ name: { $regex: new RegExp(`^${resourceInfo.name.toLowerCase()}$`, 'i') } }, (err, resource) => {
      if (err) {
        handleError(res, err);
        return;
      }

      if (resource == null) {
        // will create a new resource
        const newResource = new Resource();
        newResource.projectid = projectId;
        newResource.name = resourceInfo.name;
        newResource.resourceType = 1;
        newResource.contacts = [];

        if (resourceInfo.contacts) {
          resourceInfo.contacts.forEach((contact) => {
            newResource.contacts.push({ contactType: 1, value: contact.value });
          });
        }

        newResource.save((saveErr) => {
          if (saveErr) {
            handleError(res, saveErr);
            return;
          }

          const { id, name, resourceType, contacts } = newResource;

          const response = {
            id,
            name,
            resourceType,
            contacts,
            isNew: true,
          };

          res.json(response);
        });
      } else {
        // will use the existing resource
        const { id, name, resourceType, contacts } = resource;

        const response = {
          id,
          name,
          resourceType,
          contacts,
          isNew: false,
        };

        res.json(response);
      }
    });
  });

  router.put('/resources/:projectId/:resourceId', (req, res) => {
    const projectId = req.params.projectId;
    const resourceId = req.params.resourceId;
    const updatedResource = req.body;

    if (updatedResource.name) {
      Resource.findOne({ _id: resourceId }, (err, result) => {
        if (err) {
          handleError(res, err);
          return;
        }

        const originalResource = result;
        originalResource.name = updatedResource.name;
        originalResource.contacts = [];

        updatedResource.contacts.forEach((contact) => {
          originalResource.contacts.push({ contactType: 1, value: contact.value });
        });

        originalResource.save((saveErr) => {
          console.log('saving' + originalResource.toString());
          if (saveErr) {
            handleError(res, saveErr);
            return;
          }

          res.json({ message: 'OK' });
        });
      });
    }
  });

  router.delete('/resources/:projectId/:resourceId', (req, res) => {
    res.send('delete resource is called');
  });
};

function isValidDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
}

function handleError(response, error) {
  logger.error(error);
  response.status(500).send({ err: error });
}
