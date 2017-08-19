/**
 * setupScheduleApi.js
 *
 * Define all the schedule api here
 *
 */

const mongoose = require('mongoose');
const setupProjectApi = require('./controllers/project');
const setupTenantApi = require('./controllers/tenant');
const setupTasktApi = require('./controllers/task');
const setupResourceApi = require('./controllers/resource');

module.exports = (router) => {
  const dbConnectionString = 'mongodb://localhost:27017/litaff';

  mongoose.Promise = global.Promise;
  mongoose.connect(dbConnectionString);

  setupTenantApi(router);
  setupProjectApi(router);
  setupTasktApi(router);
  setupResourceApi(router);
};
