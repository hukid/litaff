/**
 * setupScheduleApi.js
 *
 * Define all the schedule api here
 *
 */

const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/app');
const configPassport = require('./config/passport');
const setupAuthApi = require('./controllers/auth');
const setupProjectApi = require('./controllers/project');
const setupTenantApi = require('./controllers/tenant');
const setupTasktApi = require('./controllers/task');
const setupResourceApi = require('./controllers/resource');

module.exports = (router) => {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.database, config.dbOptions);

  configPassport(passport);
  router.use(passport.initialize());

  setupAuthApi(router);
  setupTenantApi(router);
  setupProjectApi(router);
  setupTasktApi(router);
  setupResourceApi(router);
};
