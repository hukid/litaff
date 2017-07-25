/**
 * setupScheduleApi.js
 *
 * Define all the schedule api here
 *
 */

module.exports = (router) => {
  router.get('/getCalenders', (req, res) => {
    res.send('getCalenders is called');
  });

  // define tasks rest APIs
  router.get('/tasks/:projectId/:startTime/:endTime', (req, res) => {
    res.send('get tasks is called');
  });

  router.post('/tasks', (req, res) => {
    res.send('create tasks is called');
  });

  router.put('/tasks/:taskId', (req, res) => {
    res.send('update tasks is called');
  });

  router.delete('/tasks/:taskId', (req, res) => {
    res.send('delete tasks is called');
  });

  // define resources rest API
  router.get('/resources/:projectId/:type?', (req, res) => {
    res.send('get resources is called');
  });

  router.get('/resources/:projectId/:startTime/:endTime', (req, res) => {
    res.send('get available resources is called');
  });

  router.post('/resources', (req, res) => {
    res.send('create resources is called');
  });

  router.put('/resources/:resourceId', (req, res) => {
    res.send('update resource is called');
  });

  router.delete('/resources/:resourceId', (req, res) => {
    res.send('delete resource is called');
  });
};
