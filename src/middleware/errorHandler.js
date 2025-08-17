const { AppError, ValidationError, NotFoundError, DatabaseError } = require('../errors/AppError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  logger.error(err.stack);

  // Handle specific error types
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
      errors: err.errors || []
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
      resource: err.resource,
      id: err.id
    });
  }

  if (err instanceof DatabaseError) {
    // Don't expose database errors to the client
    return res.status(500).json({
      status: 'error',
      code: 'DATABASE_ERROR',
      message: 'A database error occurred'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Invalid token'
    });
  }

  // Handle validation errors from express-validator
  if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
    const errors = {};
    err.errors.forEach((error) => {
      errors[error.path] = error.message;
    });

    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors
    });
  }

  // Handle other uncaught errors
  res.status(err.statusCode || 500).json({
    status: 'error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
