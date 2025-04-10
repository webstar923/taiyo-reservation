const logger = require('./logger');

function errorLoggingMiddleware(err, req, res, next) {
  logger.error(`${err.message} - ${err.stack}`);
  res.status(500).send('Something went wrong!');
}

module.exports = errorLoggingMiddleware;
