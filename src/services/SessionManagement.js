/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF SESSION MANAGEMENT SERVICE  ====  
 * ====   AUTHOR:: AUTOPILOT <jwokomaty@gmail.com>  ====
 * ====   DATE::            3RD JULY 2020                      ====
 * =================================================================
 */

require('express-async-errors');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStoreFactory = require('connect-mongo')(session);


class SessionManagement {
  async config(app) {
    // persistence store of our session
    const sessionStore = new mongoStoreFactory({
      mongooseConnection: mongoose.connection,
      ttl: (1 * 60 * 60),
      collection: 'session'
    });

    app.use(session({
      store: sessionStore,
      secret: 'canyoukeepasecret',
      saveUninitialized: true,
      resave: false,
      cookie: {
        path: '/',
        sameSite: true,
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000  //1 hr
      },
      name: 'user_sid'
    }));
  }

  async checkSession(request, response, next) {
    if (request.cookies.user_sid && !request.session.user) {
      // expired session but unexpired cookie
      response.clearCookie('user_sid');
      next();

    } else if (request.session.user && request.cookies.user_sid) {
      // valid cookie and session
      const { id } = request.session.user;

      response.status(200).json({
        success: true,
        userId: id,
        message: 'User is already logged in'
      });
      // response.redirect('/dashboard');
    } else {
      next();
    }
  }

  // create new session for user on login
  async login(request, user) {
    request.session.user = user;

    let session = await request.session.regenerate();
    // eslint-disable-next-line curly
    if (!session) throw new CustomError('Couldn\'t refresh user session. Try again');
  }
}

module.exports = new SessionManagement();