/* eslint-disable global-require */
const express = require('express');
const bodyParser = require('body-parser');
const setupScheduleApi = require('../backend/setupScheduleApi');

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router(); // eslint-disable-line new-cap , get an instance of the express Router

// configure app to use bodyParser()
// this will let us get the data from a POST
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.json({ message: 'you hit the api' });
});

setupScheduleApi(router);

module.exports = router;
