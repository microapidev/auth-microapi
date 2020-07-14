require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/adminAuth');
const fbRouter = require('./routes/fbauth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const twitterRouter = require('./routes/twitterAuth');
const gitRouter = require('./routes/gitauth');
const emailVerificationRouter = require('./routes/EmailVerification');
const resetPasswordRouter = require('./routes/resetPassword');
const { connectDB } = require('./controllers/db');
const { errorHandler, unknownRoutes } = require('./utils/middleware');
const { authorizeUser } = require('./controllers/auth');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const openApiDocumentation = require('./swagger/openApiDocumentation');
const adminFunctionRouter = require('./routes/admin');
const GoogleUser = require('./models/googleUser');
const googleLoginRouter = require('./routes/googleLogin');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('./config/passport');

require('express-async-errors');
require('dotenv').config();

connectDB();
const SessionMgt = require('./services/SessionManagement');

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

//passport middleware
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.AUTH_API_MONGODB_URI,
      autoReconnect: true,
    }),
  })
);

// Handles via Google Login
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      GoogleUser.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) {
          return done(err);
        }
        // Check if the user is available
        if (!user) {
          let newUser = new GoogleUser({
            googleId: profile.id,
            username: profile.displayName.trim(),
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            isVerified: profile.emails[0].verified,
          });

          newUser.save((err) => {
            if (err) {
              console.log(err);
            }
            console.log('===New=Google=Profile===');
            return done(err, newUser);
          });
        } else {
          console.log('===Existing=Google=Profile===');
          // console.log(user);
          return done(err, user);
        }
      });
    }
  )
);
// Persist the user
passport.serializeUser(GoogleUser.serializeUser());
passport.deserializeUser(GoogleUser.deserializeUser());

// configure user session
SessionMgt.config(app);

// admin function routes
app.use('/api/admin', adminFunctionRouter);

// auth routes
app.use('/api/auth/admin', adminRouter());
app.use('/api/auth/user/email-verification', emailVerificationRouter());
app.use('/api/auth/user/password', resetPasswordRouter);
app.use('/api/auth/user', authorizeUser, userRouter);
app.use('/api/auth/facebook', fbRouter);
app.use('/api/auth/twitter', twitterRouter);
app.use('/api/auth/github', gitRouter);
app.use('/api/auth/google', googleLoginRouter);

// DON'T DELETE: Admin acc. verification

// app.use('/api/admin/auth/email', emailVerificationRouter());

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(unknownRoutes);
app.use(errorHandler);

module.exports = app;
