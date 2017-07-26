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

  router.post('/tasks', (req, res) => {
    res.send('create tasks is called');
  });

  router.put('/tasks/:taskId', (req, res) => {
    res.send('update tasks is called');
  });

  router.delete('/tasks/:taskId', (req, res) => {
    res.send('delete tasks is called');
  });

  // define resources rest API
  router.get('/resources/:projectId/:type?', (req, res) => {
    res.send('get resources is called');
  });

  router.get('/resources/:projectId/:startTime/:endTime', (req, res) => {
    res.send('get available resources is called');
  });

  router.post('/resources', (req, res) => {
    res.send('create resources is called');
  });

  router.put('/resources/:resourceId', (req, res) => {
    res.send('update resource is called');
  });

  router.delete('/resources/:resourceId', (req, res) => {
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
