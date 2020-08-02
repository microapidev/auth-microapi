require("dotenv").config();
const fbRouter = require("express").Router();
const passport = require("passport");
const createFacebookStrategy = require("../config/passport/facebookStrategy");
const { authorizeUser } = require("../middlewares/authorization");
const { facebookAuthProvider } = require("../middlewares/checkAuthProvider");

fbRouter.get("/", authorizeUser, facebookAuthProvider, (req, res, next) =>
  passport.authenticate(createFacebookStrategy(req.provider), {
    scope: ["email", "public_profile"],
  })(req, res, next)
);

fbRouter.get(
  "/callback",
  passport.authenticate(createFacebookStrategy(), {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(
      "https://upbeat-leavitt-2a7b54.netlify.app/pages/dashboard.html"
    );
  }
);

module.exports = fbRouter;
