class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with ID ${id} not found`, 404, 'NOT_FOUND');
    this.resource = resource;
    this.id = id;
  }
}

class DatabaseError extends AppError {
  constructor(error) {
    super('Database operation failed', 500, 'DATABASE_ERROR');
    this.originalError = error;
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  DatabaseError
};
