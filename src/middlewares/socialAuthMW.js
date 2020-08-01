const Admin = require("../models/admin");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../utils/config");
const CustomResponse = require("../utils/response");
const { CustomError } = require("../utils/CustomError");

const TWITTER_PROVIDER = "Twitter";
const FACEBOOK_PROVIDER = "Facebook";
const GITHUB_PROVIDER = "GitHub";
const GOOGLE_PROVIDER = "Google";

const twitterAuthProvider = (req, res, next) =>
  authProvider(TWITTER_PROVIDER)(req, res, next);
const facebookAuthProvider = (req, res, next) =>
  authProvider(FACEBOOK_PROVIDER)(req, res, next);
const githubAuthProvider = (req, res, next) =>
  authProvider(GITHUB_PROVIDER)(req, res, next);
const googleAuthProvider = (req, res, next) =>
  authProvider(GOOGLE_PROVIDER)(req, res, next);

const authProvider = (providerType) => {
  return async (req, res, next) => {
    const admin = await Admin.findById(req.admin.id).populate("settings");

    let provider;
    let isProviderEnabled;
    const message = `${providerType} authentication is not authorized for this account.`;

    switch (providerType) {
      case TWITTER_PROVIDER:
        provider = admin.settings.twitterAuthProvider;
        isProviderEnabled = provider && provider.key;
        break;
      case FACEBOOK_PROVIDER:
        provider = admin.settings.facebookAuthProvider;
        isProviderEnabled = provider && provider.appID;
        break;
      case GITHUB_PROVIDER:
        provider = admin.settings.githubAuthProvider;
        isProviderEnabled = provider && provider.clientID;
        break;
      case GOOGLE_PROVIDER:
        provider = admin.settings.googleAuthProvider;
        isProviderEnabled = provider && provider.clientID;
        break;

      default:
        throw new Error(
          `Authentication provider, ${providerType}, is not supported.`
        );
    }

    if (isProviderEnabled) {
      req.provider = provider;
    } else {
      throw new CustomError(message, 401);
    }

    next();
  };
};
