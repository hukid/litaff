const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const Tenant = require('../models/tenant');
const Project = require('../models/project');
const handleError = require('../utils/handleError');
const config = require('../config/app');

module.exports = (router) => {
  router.post('/users/signin', (req, res) => {
    let name = req.body.name.trim();
    if (!name) {
      res.status(422).send({ error: 'You must enter a name.' });
      return;
    }
    name = name.toLowerCase();
    User.findOne({ name })
    .select({ createdAt: 0, updatedAt: 0 })
    .exec((err, user) => {
      if (err) {
        handleError(res, err);
        return;
      }

      if (!user) {
        handleWrongLogonCredential(res);
        return;
      }

      bcrypt.compare(req.body.password, user.password, (bcryptErr, valid) => {
        if (err) {
          handleError(res, bcryptErr);
        }
        if (!valid) {
          handleWrongLogonCredential(res);
          return;
        }

        const userInfo = {
          id: user._id,
          name: user.name,
          ownTenant: user.ownTenant,
          ownProjects: user.ownProjects,
        };

        const token = generateToken(userInfo);

        res.json({
          userInfo,
          token,
        });
      });
    });
  });

  router.post('/users/verifytoken', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOne({ _id: req.user.id })
    .select({ createdAt: 0, updatedAt: 0 })
    .exec((err, user) => {
      if (err) {
        handleError(res, err);
        return;
      }

      if (!user) {
        handleWrongLogonCredential(res);
        return;
      }

      const userInfo = {
        id: user._id,
        name: user.name,
        ownTenant: user.ownTenant,
        ownProjects: user.ownProjects,
      };

      const token = generateToken(userInfo);

      res.json({
        userInfo,
        token,
      });
    });
  });

  router.post('/users/signup', (req, res) => {
    let name = req.body.name.trim();
    const password = req.body.password;

    // Return error if no email provided
    if (!name) {
      res.status(422).send({ error: 'You must enter a name.' });
      return;
    }

    // Return error if no password provided
    if (!password) {
      res.status(422).send({ error: 'You must enter a password.' });
      return;
    }

    name = name.toLowerCase();
    User.findOne({ name }, (findErr, existingUser) => {
      if (findErr) {
        handleError(res, findErr);
        return;
      }

      if (existingUser) {
        res.status(422).send({ error: 'That user name is already in use.' });
        return;
      }

      // provisioning new user now
      const newDefaultTenant = new Tenant();
      newDefaultTenant.name = name;
      newDefaultTenant.tenantType = 1;
      newDefaultTenant.save((saveTenantErr) => {
        if (saveTenantErr) {
          handleError(res, saveTenantErr);
          return;
        }

        const newDefaultProject = new Project();
        newDefaultProject.name = name;
        newDefaultProject.tenantId = newDefaultTenant._id;
        newDefaultProject.projectType = 1;
        newDefaultProject.save((saveProjectErr) => {
          if (saveProjectErr) {
            handleError(res, saveProjectErr);
            return;
          }

          const newUser = new User();
          newUser.name = name;
          newUser.password = password;
          newUser.ownTenant = newDefaultTenant._id;
          newUser.ownProjects = [{ id: newDefaultProject._id }];

          newUser.save((saveUserErr) => {
            if (saveUserErr) {
              handleError(res, saveUserErr);
              return;
            }

            const userInfo = {
              id: newUser._id,
              name: newUser.name,
              ownTenant: newUser.ownTenant,
              ownProjects: newUser.ownProjects,
            };
            const token = generateToken(userInfo);

            res.json({
              userInfo,
              token,
            });
          });
        });
      });
    });
  });
};

function handleWrongLogonCredential(res) {
  return res.status(404).json({
    error: true,
    message: 'Username or password is wrong',
  });
}

function generateToken(user) {
  const token = jwt.sign(user, config.secret, {
    expiresIn: 60 * 60 * 24, // expires in 24 hours
  });
  return token;
}
