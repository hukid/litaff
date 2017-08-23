exports.authorizeWithProjectId = (user, projectId) => {
  return user.ownProjects[0].id == projectId;
};

exports.handleAuthorizationError = (res, err) => {
  res.status(401).send({ error: err });
};
