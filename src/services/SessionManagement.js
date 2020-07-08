/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF SESSION MANAGEMENT SERVICE  ====  
 * ====   AUTHOR:: AUTOPILOT <jwokomaty@gmail.com>  ====
 * ====   DATE::            3RD JULY 2020                      ====
 * =================================================================
 */

require('express-async-errors');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStoreFactory = require('connect-mongo')(session);
const { v4: uuidv4 } = require('uuid');


// persistence store of our session
const sessionStore = new mongoStoreFactory({
  mongooseConnection: mongoose.connection,
  ttl: (1 * 60 * 60),
  collection: 'session'
});

class SessionManagement {
  async config(app) {
    app.use(session({
      store: sessionStore,
      genid: function(request) {
        return uuidv4();; // use UUIDs for session IDs
      },
      secret: 'canyoukeepasecret',
      saveUninitialized: true,
      resave: false,
      rolling: true,
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
    if (request.cookies.connect.sid && !request.session.user) {
      // expired session but unexpired cookie
      response.clearCookie('user_sid');

      next();

    } else if (request.session.user && request.cookies.connect.sid) {
      // valid cookie and session
      await request.session.regenerate();

      return response.status(200).json(CustomResponse('User is already logged in'));
      // response.redirect('/dashboard');
    }

    next();
  }

  // create new session for user on login
  login(request, user) {
    request.session.user = user;
    // sessionStore.set(genid(request), request.session)
    //   .then((ret) => console.log(ret))
    //   .catch(error => {
    //     console.log(error);
    //   });
    // eslint-disable-next-line curly
    // if (!session) throw new CustomError('Couldn\'t refresh user session. Try again');
  }
}

module.exports = new SessionManagement();