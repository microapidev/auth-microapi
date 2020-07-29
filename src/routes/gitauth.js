require("dotenv").config();
const gitRouter = require("express").Router();
const passport = require("passport");
const createGithubStrategy = require("../config/passport/githubStrategy");

gitRouter.get("/", passport.authenticate(createGithubStrategy()));

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
