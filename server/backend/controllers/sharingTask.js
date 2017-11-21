const Task = require('../models/task');
const TaskShareProfile = require('../models/taskshareprofile');
const handleError = require('../utils/handleError');

module.exports = (router) => {
  router.get('/sharingtasks/:sharingId', (req, res) => {
    const sharingId = req.params.sharingId;
    const shareProfilePromise = TaskShareProfile.findById(sharingId).exec();
    shareProfilePromise.then((shareProfile) => {
      if (shareProfile) {
        const projectId = shareProfile.timeRangeProfile.projectId;
        const startTime = shareProfile.timeRangeProfile.startTime;
        const endTime = shareProfile.timeRangeProfile.endTime;
        Task.find(
          { projectId, 'time.start': { $gt: startTime, $lt: endTime } }, null, { sort: 'time.start' },
          (err, tasks) => {
            if (err) {
              handleError(res, err);
              return;
            }

            const sharingResult = {
              profile: shareProfile.timeRangeProfile,
              tasks,
            };
            res.json(sharingResult);
          }
        );
      } else {
        const startTime = new Date(2017, 1, 1);
        const endTime = new Date(2018, 1, 1);
        Task.find(
          { 'time.start': { $gt: startTime, $lt: endTime } }, null, { sort: 'time.start' },
          (err, tasks) => {
            if (err) {
              handleError(res, err);
              return;
            }

            const sharingResult = {
              profile: {
                startTime,
                endTime,
              },
              tasks,
            };
            res.json(sharingResult);
          }
        );
      }
    })
    .catch((error) => {
      handleError(res, error);
    });
  });
};
