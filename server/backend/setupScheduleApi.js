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
};
