const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/adminAuth');
const emailVerificationRouter = require('./routes/EmailVerification');
const { connectDB, DB } = require('./controllers/db');
const { authorizeUser, errorHandler, unknownRoutes } = require('./utils/middleware');
// const swaggerDocs = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('passport');
const openApiDocumentation = require('./swagger/openApiDocumentation');
require('express-async-errors');
require('dotenv').config();

connectDB();

//passport middleware
app.use(session({
    secret: 'facebook-login-app',
    resave: true,
    saveUninitialized: true
}));


app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// initialize express-session to allow us track the logged-in user.
// app.use(session({
//   key: 'user_sid',
//   secret: 'somerandonstuffsjl',
//   resave: false,
//   saveUninitialized: false,
// }));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// auth routes
app.use('/api/admin/auth', adminRouter);
app.use('/api/auth/email', emailVerificationRouter());
app.use('/api/auth', authorizeUser, userRouter);
app.use('/api/admin/auth/email', emailVerificationRouter());




app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(unknownRoutes);
app.use(errorHandler);

module.exports = app;
