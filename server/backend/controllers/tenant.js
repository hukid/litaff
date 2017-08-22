const Tenant = require('../models/tenant');
const handleError = require('../utils/handleError');

module.exports = (router) => {
  const defaultTenantName = 'devTenant';

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
};
