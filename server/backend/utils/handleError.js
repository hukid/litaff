const logger = require('../../logger');

module.exports = (response, error) => {
  logger.error(error);
  response.status(500).send({ err: error });
};
