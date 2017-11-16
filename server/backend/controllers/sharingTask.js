const Task = require('../models/task');
const handleError = require('../utils/handleError');

module.exports = (router) => {
  router.get('/sharingtasks/:sharingId', (req, res) => {
    const startTime = new Date(2017, 1, 1);
    Task.find(
      { projectId: '59a7afe80bb4d73dcc435075', 'time.start': { $gt: startTime } }, null, { sort: 'time.start' },
      (err, tasks) => {
        if (err) {
          handleError(res, err);
          return;
        }

        res.json(tasks);
      }
    );
  });
};
