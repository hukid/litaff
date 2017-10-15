const logger = require('../../logger');
const Task = require('../models/task');

module.exports = (originalResource, newName) => {
  Task.update(
    { 'resources.id': originalResource.id },
    { 'resources.$.name': newName },
    { multi: true },
    (err, raw) => {
      if (err) {
        return logger.error(`failed to sync resource ${originalResource.id}, error is : ${err}`);
      }
      return logger.info(`successfully synced ${raw}`);
    }
  );
};
