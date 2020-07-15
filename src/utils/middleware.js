const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../utils/config');
const CustomResponse = require('../utils/response');


const auth = async (request, response, next) => {

  let userId = request.cookies.w_auth;

  User.findByToken(userId, (err, user) => {
    if (err) { throw err; }
    if (!user) {
      return response.json({
        isAuth: false,
        error: true,
        msg: 'UnAuthorised/Invalid user'
      });
    }
    request.user = user;
    next();
  });
};

const unknownRoutes = (request, response, next) => {
  // This middleware returns response when client tries to access unknown routes through this domain
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  // This middleware handles errors responses sent to client
  if (error.name === 'ValidationError') {
    response.status(400).json(
      CustomResponse('ValidationError', { statusCode: 422, message: error.message }, false)
    );
  } else if (error.name === 'SyntaxError') {
    response.status(401).json(
      CustomResponse('SyntaxError', { statusCode: 422, message: error.message }, false)
    );
  } else if (error.name === 'JsonWebTokenError') {
    response.status(401).json(
      CustomResponse('JsonWebTokenError', { statusCode: 401, message: error.message }, false)
    );
  } else if (error.name === 'CustomError') {
    response.status(error.status).json(
      CustomResponse(error.message, { statusCode: error.status, message: error.message }, false)
    );
  } else if (error.name === 'TypeError') {
    response.status(400).send('fn error');
  }
  else {
    response.status(500).json(CustomResponse('Unhandled Error', error = { statusCode: 500, message: 'Unhandled Error' }, false));
  }
  // next(error);
};


module.exports = {
  auth,
  errorHandler,
  unknownRoutes
};