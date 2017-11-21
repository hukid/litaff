const passport = require('passport');
const TaskShareProfile = require('../models/taskshareprofile');
const handleError = require('../utils/handleError');
const authorizeWithProjectId = require('../utils/authorization').authorizeWithProjectId;
const handleAuthorizationError = require('../utils/authorization').handleAuthorizationError;

function isValidDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
}

function isValidSharingProfile(sharingProfile) {
  return sharingProfile.startTime
          && sharingProfile.endTime;
}

module.exports = (router) => {
  router.post('/taskshareprofile/:projectId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;
    if (!authorizeWithProjectId(req.user, projectId)) {
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    // TODO Get sharing profile from the request body
    const sharingProfile = req.body;
    if (isValidSharingProfile(sharingProfile)) {
      const startTime = new Date(sharingProfile.startTime);
      const endTime = new Date(sharingProfile.endTime);
      if (isValidDate(startTime) && isValidDate(endTime) && startTime.getTime() < endTime.getTime()) {
        const newProfile = new TaskShareProfile();
        newProfile.profileType = 1;
        newProfile.timeRangeProfile = {
          projectId,
          startTime,
          endTime,
        };
        newProfile.save((saveErr) => {
          if (saveErr) {
            handleError(res, saveErr);
            return;
          }
          res.json({ sharingId: newProfile.id });
        });
      } else {
        handleError(res, 'Not a valid sharing time range');
      }
    } else {
      handleError(res, 'Not a valid sharing profile');
    }
  });
};
