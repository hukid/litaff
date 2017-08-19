const Resource = require('../models/resource');
const handleError = require('../utils/handleError');

module.exports = (router) => {
  // define resources rest API
  router.get('/resources/:projectId/:type?', (req, res) => {
    const projectId = req.params.projectId;

    Resource.find({ projectId }, (err, resources) => {
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
