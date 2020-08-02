require("dotenv").config();
const gitRouter = require("express").Router();
const passport = require("passport");
const createGithubStrategy = require("../config/passport/githubStrategy");
const { githubAuthProvider } = require("../middlewares/checkAuthProvider");
const { authorizeUser } = require("../middlewares/authorization");

gitRouter.get("/", authorizeUser, githubAuthProvider, (req, res, next) =>
  passport.authenticate(createGithubStrategy(req.provider))(req, res, next)
);

gitRouter.get(
  "/callback",
  passport.authenticate(createGithubStrategy(), { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(
      "https://upbeat-leavitt-2a7b54.netlify.app/pages/dashboard.html"
    );
  }
);

module.exports = gitRouter;
