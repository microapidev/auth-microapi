/**
  * This middleware serves as governance and security for authorizing access to all routes provisioned by the authentication microservice. It checks for whichever of the following tokens is provided by its users, and verifies whichever is provided against a secret. 
  * @param serviceKey ==> API KEY to guard access to API usage; this service token is gotten from MICROAPI, and is used to grant authorization to all subsequent actions related to a project running on the authentication microservice.
  * @param accessKey  ==> Guards Admin routes; generated when a new project is initialized. It controls access to admin specific routes, such as routes for api configuration and user analytics. Access key gives permissions for multiple admins 
  * @param sessionKey ==> Controls User Session on a project; It is generated and provided to user on log in, and is used for user specific actions.
**/

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../utils/config");

const authorizeUser = (request, response, next) => {

  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    const decodedUser = jwt.verify(token, JWT_ADMIN_SECRET);

    if (!decodedUser.id) {
      return response.status(403).json({ error: "Invalid API_KEY" });
    }
    // TODO: link users using admin access token, use kaseem's auth middleware
    // TODO: if user has unverified email refer them to email verificaton; use sessions maybe
    request.admin = decodedUser;
  } else {
    return response.status(401).send("Access denied. No token provided.");
  }

  next();
};

const auth = async (request, response, next) => {
  let userId = request.sessions.user;

  User.findByToken(userId, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      return response.json({
        isAuth: false,
        error: true,
        msg: "UnAuthorised/Invalid user",
      });
    }
    request.user = user;
    next();
  });
};

module.exports = {
  authorizeUser,
  auth
};