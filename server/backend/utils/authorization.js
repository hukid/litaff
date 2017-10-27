exports.authorizeWithProjectId = (user, projectId) => user.ownProjects[0].id == projectId; // eslint-disable-line eqeqeq

exports.handleAuthorizationError = (res, err) => {
  res.status(401).send({ error: err });
};
