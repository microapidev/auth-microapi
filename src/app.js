require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
// const passport = require('passport');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/adminAuth');
const fbRouter = require('./routes/fbauth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const twitterRouter = require('./routes/twitterAuth');
const gitRouter = require('./routes/gitauth');
const emailVerificationRouter = require('./routes/EmailVerification');
// const resetPasswordRouter = require('./routes/resetPassword');
const { connectDB } = require('./controllers/db');
const {
  authorizeUser,
  errorHandler,
  unknownRoutes,
} = require('./middlewares/middleware');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./swagger/openApiDocumentation');
// const adminFunctionRouter = require('./routes/admin');
const googleLoginRouter = require('./routes/googleLogin');
require('./config/passport/twitterStrategy');
require('./config/passport/githubStrategy');
require('./config/passport/googleStrategy');
require('./config/passport/facebookStrategy');

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

// passport middleware
// app.use(
//   session({
//     resave: true,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET,
//     cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
//     store: new MongoStore({
//       url: process.env.AUTH_API_MONGODB_URI,
//       autoReconnect: true,
//     }),
//   })
// );


// configure user session
SessionMgt.config(app);

// auth routes
app.use('/api/admin', adminRouter());
app.use('/api/user/email-verification', emailVerificationRouter());
app.use('/api/user', authorizeUser, userRouter());
app.use('/api/facebook', fbRouter);
app.use('/api/twitter', twitterRouter);
app.use('/api/github', gitRouter);
app.use('/api/google', authorizeUser, googleLoginRouter);

// DON'T DELETE: Admin acc. verification

// app.use('/api/admin/auth/email', emailVerificationRouter());
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(unknownRoutes);
app.use(errorHandler);

module.exports = app;
