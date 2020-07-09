require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/adminAuth');
const adminFunctionRouter = require('./routes/admin');
const fbRouter = require('./routes/fbauth');
const gitRouter = require('./routes/gitauth');
const emailVerificationRouter = require('./routes/EmailVerification');
const resetPasswordRouter = require('./routes/resetPassword');
const { connectDB } = require('./controllers/db');
const { errorHandler, unknownRoutes } = require('./utils/middleware');
const { authorizeUser } = require('./controllers/auth');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const session = require('express-session');

const openApiDocumentation = require('./swagger/openApiDocumentation');

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
app.use(session({
  secret: 'facebook-login-app',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());



// configure user session
SessionMgt.config(app);

// admin function routes
app.use('/api/admin',adminFunctionRouter);

// auth routes
app.use('/api/auth/admin', adminRouter);
app.use('/api/auth/user/email-verification', emailVerificationRouter());
app.use('/api/auth/user/password', resetPasswordRouter);
app.use('/api/auth/user', authorizeUser, userRouter);
app.use('/api/fb-auth/user', fbRouter);
app.use('/api/git-auth/user', gitRouter);

// DON'T DELETE: Admin acc. verification

// app.use('/api/admin/auth/email', emailVerificationRouter());



app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(unknownRoutes);
app.use(errorHandler);



module.exports = app;
