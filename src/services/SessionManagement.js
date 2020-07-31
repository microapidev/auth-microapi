/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF SESSION MANAGEMENT SERVICE  ====  
 * ====   AUTHOR:: AUTOPILOT <jwokomaty@gmail.com>  ====
 * ====   DATE::            3RD JULY 2020                      ====
 * =================================================================
 */

const mongoose = require("mongoose");
const session = require("express-session");
const mongoStoreFactory = require("connect-mongo")(session);
const passport = require("passport");
const CustomResponse = require("../utils/response");
const { v4: uuidv4 } = require("uuid");


// persistence store of our session
const sessionStore = new mongoStoreFactory({
  mongooseConnection: mongoose.connection,
  collection: "sessions"
});

const sess = {
  store: sessionStore,
  genid: function () {
    return uuidv4();; // use UUIDs for session IDs
  },
  secret: "canyoukeepasecret",
  saveUninitialized: false,
  resave: false,
  rolling: true,
  cookie: {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000  //24 hours
  },
  name: "user_sid"
};

class SessionManagement {
  async config(app) {
    if (app.get("env") === "production") {
      app.set("trust proxy", 1); // trust first proxy
      sess.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sess));
    app.use(passport.initialize());
    app.use(passport.session());
  }

  async checkSession(request, response, next) {
    if (request.session.isLoggedIn) {
      // validate login with session cookie

      sessionStore.get(request.session.id)
        .then(() => {
          
        })
        .catch(error => {
          console.log(error);
        });
      return response.status(200).json(CustomResponse("User is already logged in, redirect them to dashboard."));

    } 
    // If there's no session, create dummy session with admin id, app id, and user's IP instantiating request

    request.session.flag = {
      admin: request.admin,
      remoteAddress: request.ip
    };
    // cookie remains only for duration of user-agent
    request.session.cookie.expires = false;

    sessionStore.set(sess.genid(), request.session)
      .then(() => {
          
      })
      .catch(error => {
        console.log(error);
      });
    next();
    

  }

  // create new session for user on login
  login(request, user) {
    // on login, check session store if session id exists
    request.session.user = user;
    request.session.isLoggedIn = true;
    request.session.flag = {
      admin: request.admin,
      remoteAddress: request.ip
    };
    sessionStore.set(sess.genid(), request.session)
      .then(() => {
        
      })
      .catch(error => {
        console.log(error);
      });
    // eslint-disable-next-line curly
    // if (!session) throw new CustomError('Couldn\'t refresh user session. Try again');
  }

  logout(request) {
    sessionStore.destroy(request.session.id)
      .then(() => {
        request.session.destroy();
      })
      .catch(error => {
        console.log(error);
      });
  }
}

module.exports = new SessionManagement();