const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../utils/config');

const authorizeUser = async (request, response, next) => {
  // This middleware authorizes users by checking if valid API_KEY is sent with the request

  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedUser = jwt.verify(token, JWT_ADMIN_SECRET);

    if (!decodedUser.id) {
      return response.status(403).json({ error: 'Invalid API_KEY' });
    }
    // request.adminUser = decodedUser;
  } else {
    return response.status(401).send('Access denied. No token provided.');
  }

  next();
};

const auth = (req, res, next) => {
  let token = req.cookies.w_auth;
const auth = async (request, response, next) => {
  // This middleware will check if client's cookie is still saved in user agent
  // const token = request.cookies.w_auth;

  // console.log(token)

  // const user = await User.findByToken(token);

  // if (!user) {
  //   return response.status(301).json({
  //     sucess: false,
  //     msg: "UnAuthorised"
  //   })
  // }

  // console.log("middleware token", user)

  // request.token = token;
  // request.user = user;

  // if (request.cookies.user_sid && !request.session.user && !request.session.isAdmin) {
  //   response.clearCookie('user_sid');
  // }

  // next();
  let token = request.cookies.w_auth;

  // console.log("token middleware", token)

  const user = await User.findByToken(token);
  console.log('findByToken', user);

  User.findByToken(token, (err, user) => {
    if (err) {throw err;}
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });
    {return response.json({
      isAuth: false,
      error: true,
      msg: 'UnAuthorised/Invalid token'
    });}
    console.log('users middleware', user);
    req.token = token;
    req.user = user;
    next();
  });
};

const unknownRoutes = (request, response, next) => {
  // This middleware returns response when client tries to access unknown routes through this domain
  response.status(404).send({ error: 'unknown endpoint' });

};

const errorHandler = (error, req, res, next) => {
    return res.status(error.status || 500).json({
        error: {
            message: error.message || "Oops Something wrong!"
        }
    })
}

module.exports = {
  auth,
  authorizeUser,
  errorHandler,
  unknownRoutes
};