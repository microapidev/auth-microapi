require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/adminAuth');
const GoogleUser = require('./models/googleUser');
const googleLoginRouter = require('./routes/googleLogin');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const emailVerificationRouter = require('./routes/EmailVerification');
const { connectDB } = require('./controllers/db');
const { errorHandler, unknownRoutes } = require('./utils/middleware');
const { authorizeUser } = require('./controllers/auth');
// const swaggerDocs = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./swagger/openApiDocumentation');
connectDB();
const SessionMgt = require('./services/SessionManagement');


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Handles via Google Login
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    GoogleUser.findOne({email: profile.emails[0].value}, (err, user) => {
      if(err)
      {return done(err);}
      // Check if the user is available
      if(!user){
        let newUser = new GoogleUser({
          googleId: profile.id,
          username: profile.displayName.trim(),
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: profile.emails[0].value,
          isVerified: profile.emails[0].verified
        });

        newUser.save((err) => {
          if(err) {console.log(err);}

          console.log('===New=Google=Profile===');
          return done(err, newUser);
        });
      }else{
        console.log('===Existing=Google=Profile===');
        console.log(user);
        return done(err, user);
      }

    });
  })
);
// Persist the user
passport.serializeUser(GoogleUser.serializeUser());
passport.deserializeUser(GoogleUser.deserializeUser());

// configure user session
SessionMgt.config(app);

// auth routes
app.use('/api/admin/auth', adminRouter);
app.use('/api/auth/email', emailVerificationRouter());
app.use('/api/auth/google', googleLoginRouter);
app.use('/api/auth', authorizeUser, userRouter);
// DON'T DELETE: Admin acc. verification
// app.use('/api/admin/auth/email', emailVerificationRouter());


app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(unknownRoutes);
app.use(errorHandler);

module.exports = app;
