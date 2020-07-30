const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../utils/config');
const CustomResponse = require('../utils/response');


const auth = async (request, response, next) => {

  let userId = request.sessions.user;

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

const authorizeUser = (request, response, next) => {
  // This middleware authorizes users by checking if valid API_KEY is sent with the request

  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedUser = jwt.verify(token, JWT_ADMIN_SECRET);

    if (!decodedUser.id) {
      return response.status(403).json({ error: 'Invalid API_KEY' });
    }
    // TODO: link users using admin access token, use kaseem's auth middleware
    // TODO: if user has unverified email refer them to email verificaton; use sessions maybe
    request.admin = decodedUser;
  } else {
    return response.status(401).send('Access denied. No token provided.');
  }

  next();
};

const unknownRoutes = (request, response, next) => {
  // This middleware returns response when client tries to access unknown routes through this domain
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  // This middleware handles errors responses sent to client
  console.log(error);
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
  } else {
    response.status(500).json(CustomResponse('Unhandled Error', error = { statusCode: 500, message: 'Unhandled Error' }, false));
  }
  // next(error);
};


module.exports = {
  authorizeUser,
  auth,
  errorHandler,
  unknownRoutes
};