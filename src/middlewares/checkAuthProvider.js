const Admin = require("../models/admin");
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
    const { successCallbackUrl, failureCallbackUrl } = admin.settings;

    console.log(successCallbackUrl);

    let provider;
    let providerEnabled = false;
    const callbacksAvailable =
      successCallbackUrl !== null && failureCallbackUrl !== null;

    console.log(callbacksAvailable);

    switch (providerType) {
      case TWITTER_PROVIDER:
        provider = admin.settings.twitterAuthProvider;
        providerEnabled = provider && provider.key;
        break;
      case FACEBOOK_PROVIDER:
        provider = admin.settings.facebookAuthProvider;
        providerEnabled = provider && provider.appID;
        break;
      case GITHUB_PROVIDER:
        provider = admin.settings.githubAuthProvider;
        providerEnabled = provider && provider.clientID;
        break;
      case GOOGLE_PROVIDER:
        provider = admin.settings.googleAuthProvider;
        providerEnabled = provider && provider.clientID;
        break;

      default:
        throw new Error(
          `Authentication provider, ${providerType}, is not supported.`
        );
    }

    if (providerEnabled && callbacksAvailable) {
      req.provider = provider;
      req.successCallbackUrl = successCallbackUrl;
      req.failureCallbackUrl = failureCallbackUrl;

      next();
    } else {
      const message = `${providerType} authentication is not authorized for this account.`;
      res
        .status(401)
        .json(CustomResponse(message, { statusCode: 401, message }, false));
    }
  };
};

module.exports = {
  twitterAuthProvider,
  facebookAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
};
