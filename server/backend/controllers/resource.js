const passport = require('passport');
const Resource = require('../models/resource');
const Task = require('../models/task');
const handleError = require('../utils/handleError');
const authorizeWithProjectId = require('../utils/authorization').authorizeWithProjectId;
const handleAuthorizationError = require('../utils/authorization').handleAuthorizationError;
const sendScheduleNotification = require('../utils/sendScheduleNotification');
const logger = require('../../logger');
const syncResourceName = require('../utils/syncResourceName');

module.exports = (router) => {
  // define resources rest API
  router.get('/resources/:projectId/:type?', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;

    if (!authorizeWithProjectId(req.user, projectId)) {
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    Resource.find({ projectId }, (err, resources) => {
      if (err) {
        handleError(res, err);
        return;
      }

      res.json(resources);
    });
  });

  router.get('/resources/:projectId/:startTime/:endTime', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('get available resources is called');
  });

  router.post('/resources/:projectId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;
    const resourceInfo = req.body;
    if (!authorizeWithProjectId(req.user, projectId)) {
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    Resource.findOne({ name: { $regex: new RegExp(`^${resourceInfo.name.toLowerCase()}$`, 'i') }, projectId }, (err, resource) => {
      if (err) {
        handleError(res, err);
        return;
      }

      if (resource == null) {
        // will create a new resource
        const newResource = new Resource();
        newResource.projectId = projectId;
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

  router.put('/resources/:projectId/:resourceId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;
    const resourceId = req.params.resourceId;
    const updatedResource = req.body;
    if (!authorizeWithProjectId(req.user, projectId)) {
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    if (updatedResource.name) {
      Resource.findOne({ name: { $regex: new RegExp(`^${updatedResource.name.toLowerCase()}$`, 'i') }, projectId }, (err, resource) => {
        if (err) {
          handleError(res, err);
          return;
        }
        if (resource && resourceId !== resource.id.toString()) {
          handleError(res, 'new name has been taken');
          return;
        }

        const promise = Resource.findOneAndUpdate({ _id: resourceId, projectId }, { name: updatedResource.name, contacts: updatedResource.contacts }).exec();

        promise
        .then((origResource) => {
          logger.info(`${origResource.id} is updated`);
          res.json({ message: 'OK' });

          if (updatedResource.name !== origResource.name) {
            // sync updated resource when the name is chnaged
            syncResourceName(origResource, updatedResource.name);
          }

          if (checkContactUpdatedOrAdded(updatedResource.contacts, origResource.contacts)) {
            Task.find({ resources: { $elemMatch: { id: origResource.id } } }, (taskFindErr, tasks) => {
              if (taskFindErr) {
                logger.error(taskFindErr);
                return;
              }

              if (updatedResource.contacts[0].contactType === 1) {
                // const toList = [`${updatedResource.name} <${updatedResource.contacts[0].value}>`];
                tasks.forEach((task, index) => {
                  setTimeout(() => {
                    sendScheduleNotification(task, 2);
                  }, 200 * index);
                });
              }
            });
          }
        })
        .catch((updateError) => {
          handleError(res, updateError);
        });
      });
    } else {
      handleError(res, 'Cannot update with empty name');
    }
  });

  router.delete('/resources/:projectId/:resourceId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const projectId = req.params.projectId;
    const resourceId = req.params.resourceId;
    if (!authorizeWithProjectId(req.user, projectId)) {
      handleAuthorizationError(res, 'you do not have permission');
      return;
    }

    const promise = Resource.findByIdAndRemove(resourceId).exec();
    promise.then((resource) => {
      logger.info(`Resource ${resource.id} is deleted`);
      res.json({ message: 'OK' });
    })
    .catch((error) => {
      handleError(res, error);
    });
  });
};

// Check if new contact added as primary contact method
function checkContactUpdatedOrAdded(newContacts, oldContacts) {
  if (newContacts && newContacts.length > 0
      && (!oldContacts || oldContacts.length === 0 || oldContacts[0].contactType !== newContacts[0].contactType || oldContacts[0].value !== newContacts[0].value)) {
    return true;
  }

  return false;
}
