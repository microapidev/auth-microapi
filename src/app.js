require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/auth");
const adminRouter = require("./routes/adminAuth");
const socialRoutes = require("./routes/socialsRoutes");
const emailVerificationRouter = require("./routes/EmailVerification");
const { connectDB } = require("./controllers/db");
const {
  authorizeUser,
  errorHandler,
  unknownRoutes,
} = require("./middlewares/middleware");
const googleLoginRouter = require("./routes/googleLogin");
require("./config/passport/twitterStrategy");
require("./config/passport/githubStrategy");
require("./config/passport/googleStrategy");
require("./config/passport/facebookStrategy");

require("dotenv").config();

connectDB();
const SessionMgt = require("./services/SessionManagement");

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// configure user session
SessionMgt.config(app);

// auth routes
app.use("/api/admin", adminRouter());
app.use("/api/user/email-verification", emailVerificationRouter());
app.use("/api/user/password", userRouter());
app.use("/api/user", authorizeUser, userRouter());
app.use("/api", socialRoutes);

// documentation routes
app.use("/", docRouter);

app.use(unknownRoutes);
app.use(errorHandler);

module.exports = app;
