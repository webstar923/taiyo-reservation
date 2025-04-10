const logger = require('./logger');

function apiLoggingMiddleware(req, res, next) {
  const logMessage = `${req.method} ${req.originalUrl} ${req.ip}`;
  logger.info(logMessage);
  next();
}

module.exports = apiLoggingMiddleware;