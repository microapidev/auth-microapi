const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/auth');
const adminRouter = require('./routes/adminAuth');
const emailVerificationRouter = require('./routes/EmailVerification');
const { connectDB } = require('./controllers/db');
const { authorizeUser, errorHandler, unknownRoutes } = require('./utils/middleware');
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

// auth routes
app.use('/api/admin/auth', adminRouter);
app.use('/api/auth/email', emailVerificationRouter());
app.use('/api/auth', authorizeUser, userRouter);
// app.use('/api/admin/auth/email', emailVerificationRouter());


app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(unknownRoutes);
app.use(errorHandler);

module.exports = app;
