const express = require("express");
const passport = require("passport");
const { google } = require("googleapis");
const createGoogleStrategy = require("../config/passport/googleStrategy");
const {
  authorizeUser,
  googleAuthProvider,
} = require("../middlewares/middleware");
const route = express.Router();

// The credentials of all who are currently undergoing Google's authentication flow.
const activeCredentials = {};

route.get("/", authorizeUser, googleAuthProvider, async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    req.provider.clientID,
    req.provider.clientSecret,
    `${process.env.HOST}/api/google/callback`
  );

  // Cache the credentials of the admin who owns them
  activeCredentials[req.provider.clientID] = {
    clientID: req.provider.clientID,
    clientSecret: req.provider.clientSecret,
  };

  // generate a url that asks permissions for Blogger and Google Calendar scopes
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope you can pass it as a string
    scope: scopes,

    // Add the client ID to ensure the correnct credentials are used on server response (callback)
    state: req.provider.clientID,
  });

  return res.json({ redirectUrl: url });
});

route.get(
  "/callback",
  (req, res, next) => {
    const provider = activeCredentials[req.query.state];

    // Remove the credentials from the cache.
    activeCredentials[req.query.state] = null;

    console.log(provider);

    passport.authenticate(createGoogleStrategy(provider), {
      failureRedirect: "/api/google",
    })(req, res, next);
  },
  (req, res) => {
    console.log(req.user);
    res.status(200).json({
      success: true,
      message: "Google authenticated",
      user: req.user,
    });
  }
);

module.exports = route;
