exports.authorizeWithProjectId = (user, projectId) => {
  return user.ownProjects[0].id == projectId;
};
