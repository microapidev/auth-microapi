
const { User } = require('../models/user');
const { AuthError } = require('../utils/error');

const auth = (req, res, next) => {
  const token = req.cookies.w_auth;

  User.findByToken(token, (err, user) => {
    if (err) {
      return next(new AuthError(err, 500));
    }

    if (!user) {
      return res.json({
        isAuth: false,
        error: true,
      });
    }

    req.token = token;
    req.user = user;
    next();
  });
  // This middleware will check if user's cookie is still saved in browser and user is not set
  app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user && !req.session.isAdmin) {
      res.clearCookie('user_sid');        
    }
    next();
  });
};

module.exports = { auth };
