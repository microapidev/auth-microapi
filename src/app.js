const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/adminAuth');
const emailVerificationRouter = require('./routes/EmailVerification');
const { connectDB } = require('./controllers/db');
const { authorizeUser, errorHandler, unknownRoutes } = require('./utils/middleware');
//const {mongoStoreFactory} = require('connect-mongo')
// const swaggerDocs = require('./swagger.json');
const { AUTH_API_DB } = require('./utils/config');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./swagger/openApiDocumentation');
const session = require('express-session')
require('express-async-errors');
require('dotenv').config();

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// auth routes
app.use('/api/admin/auth', adminRouter);
app.use('/api/auth/email', emailVerificationRouter());
app.use('/api/auth', authorizeUser, userRouter);
// app.use('/api/admin/auth/email', emailVerificationRouter());


app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(unknownRoutes);
app.use(errorHandler);
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return userId()
  },
  store: connectDB(),
  secret: 'user_sid',
  saveUninitialized: true,
  resave: false,
  cookie: {
      path: "/",
      httpOnly: true,
      secure: true,
      name: "id"
  },
 name: "id"
}));

module.exports = app;
