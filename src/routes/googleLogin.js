const express = require("express");
const passport = require("passport");
const url = require("url");
const { google } = require("googleapis");
const CustomResponse = require("../utils/response");
const settingsMiddleware = require("../middlewares/settings");
const createGoogleStrategy = require("../config/passport/googleStrategy");
const {
  authorizeUser,
  googleAuthProvider,
} = require("../middlewares/middleware");
const route = express.Router();

// The credentials of all who are currently undergoing Google's authentication flow.
const activeCredentials = {};

route.get("/", settingsMiddleware, authorizeUser, googleAuthProvider, async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      req.provider.clientID,
      req.provider.clientSecret,
      `${process.env.HOST}/api/google/callback`
    );

    // Cache the credentials of the admin who owns them
    activeCredentials[req.provider.clientID] = {
      clientID: req.provider.clientID,
      clientSecret: req.provider.clientSecret,
      successCallbackUrl: req.successCallbackUrl,
      failureCallbackUrl: req.failureCallbackUrl,
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

    res.json(
      CustomResponse(
        "Successfully retrieved Google's authentication URL.",
        { redirectUrl: url },
        true
      )
    );
  } catch (error) {
    res
      .status(500)
      .json(
        CustomResponse(
          "Unhandled Error",
          { statusCode: 500, message: error.message },
          false
        )
      );
  }
});

route.get(
  "/callback",
  (req, res, next) => {
    const provider = activeCredentials[req.query.state];
    req.successCallbackUrl = provider.successCallbackUrl;

    // Remove the credentials from the cache.
    activeCredentials[req.query.state] = null;

    const failureRedirect = url.format({
      pathname: provider.failureCallbackUrl,
      query: {
        success: false,
      },
    });

    passport.authenticate(createGoogleStrategy(provider), {
      failureFlash: true,
      failureRedirect,
    })(req, res, next);
  },
  (req, res) => {
    const {
      _id,
      isVerified,
      firstname,
      lastname,
      username,
      email,
      photo,
    } = req.user;

    const successRedirect = url.format({
      pathname: req.successCallbackUrl,
      query: {
        success: true,
        id: _id.toString(),
        isVerified,
        firstname,
        lastname,
        username,
        email,
        photo,
      },
    });

    res.redirect(successRedirect);
  }
);

module.exports = route;
