const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/auth");
const adminRouter = require("./routes/adminAuth");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const expressStatusMonitor = require("express-status-monitor");

const emailVerificationRouter = require("./routes/EmailVerification");
const { connectDB } = require("./controllers/db");
const {
  authorizeUser,
  errorHandler,
  unknownRoutes,
} = require("./utils/middleware");
const passport = require("passport");

// const swaggerDocs = require('./swagger.json');
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./swagger/openApiDocumentation");
require("express-async-errors");
require("dotenv").config();
require("./config/passport");
connectDB();
app.set("port", process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(expressStatusMonitor());
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
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
app.use(passport.initialize());
app.use(passport.session());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// auth routes
app.use("/api/admin/auth", adminRouter);
app.use("/api/auth/email", emailVerificationRouter());
app.use("/api/auth", authorizeUser, userRouter);
// app.use('/api/admin/auth/email', emailVerificationRouter());

app.use("/", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === "development") {
  // only use in development

  app.use(unknownRoutes);
  app.use(errorHandler);
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Server Error");
  });
}

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
