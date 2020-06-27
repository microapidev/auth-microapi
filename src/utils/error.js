class AppError extends Error {
  constructor(message, statusCode, description) {
    super(message);
    this.description = description;
    this.statusCode = statusCode;
  }
}
class AuthError extends AppError {
  constructor(message, statusCode) {
    const description = 'an error occured authenticating the user';
    super(message, statusCode, description);
  }
}

class DbError extends AppError {
  constructor(message, statusCode) {
    const description = 'an error occured connecting to the database';
    super(message, statusCode, description);
  }
}

class HashError extends AppError {
  constructor(message, statusCode) {
    const description = 'an error occured hashing the password';
    super(message, statusCode, description);
  }
}

class RouteError extends AppError {
  constructor(message, statusCode) {
    const description = 'cannot make request to this route';
    super(message, statusCode, description);
  }
}

const errorHandler = (error, req, res, next) =>
  error instanceof AppError
    ? res.status(error.statusCode).json({
      description: error.description,
      error: error.message,
    })
    : res.status(500).json({
      description: 'an error occured while processing your request',
      error: 'internal server error',
      devErr: error,
    });

module.exports = {
  AuthError,
  DbError,
  HashError,
  RouteError,
  errorHandler,
};
