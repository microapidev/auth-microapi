const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/adminAuth');
const emailVerificationRouter = require('./routes/EmailVerification');
const { connectDB, DB } = require('./controllers/db');
const { authorizeUser, errorHandler, unknownRoutes, auth } = require('./utils/middleware');
// const swaggerDocs = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./swagger/openApiDocumentation');
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

app.get('/api/auth/user/active', auth, (req, res) => {
  res.status(200).json({
    _id: req.user.id,
    isAdmin: req.user.isEmailVerified,
    isAuth: true,
    email: req.user.email,
    username: req.user.username,
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
