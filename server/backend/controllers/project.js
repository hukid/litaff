const Project = require('../models/project');
const Tenant = require('../models/tenant');
const handleError = require('../utils/handleError');

module.exports = (router) => {
  const defaultProjectName = 'devProject';

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
};
