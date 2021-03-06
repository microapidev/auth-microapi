import CustomError from "../utils/customError";
import testSettings from "./__test__/testSettings";

// Supported federated authentication providers.
export const FACEBOOK_PROVIDER = "Facebook";
export const GITHUB_PROVIDER = "GitHub";
export const GOOGLE_PROVIDER = "Google";
export const TWITTER_PROVIDER = "Twitter";

/**
 * Authentication provider middleware to verify if the provider is configured or not.
 *
 * The providerType will be used to check for the correct configuration settings.
 *
 * If the provider is not configured in the settings, the middleware will return a 401 error.
 * Else, the next middleware will be called with the provider information.
 *
 * @param {string} providerType - One of the supported federated authentication providers.
 */
const authProvider = (providerType) => {
  return async (req, res, next) => {
    let provider;
    let providerEnabled = false;

    // Test Data
    req.settings = testSettings();

    switch (providerType) {
      case FACEBOOK_PROVIDER:
        provider = req.settings.facebookAuthProvider;
        providerEnabled = provider && provider.appID && provider.appSecret;
        break;
      case GITHUB_PROVIDER:
        provider = req.settings.githubAuthProvider;
        providerEnabled =
          provider && provider.clientID && provider.clientSecret;
        break;
      case GOOGLE_PROVIDER:
        provider = req.settings.googleAuthProvider;
        providerEnabled =
          provider && provider.clientID && provider.clientSecret;
        break;
      case TWITTER_PROVIDER:
        provider = req.settings.twitterAuthProvider;
        providerEnabled =
          provider && provider.consumerKey && provider.consumerSecret;
        break;

      default:
        throw new Error(
          `Authentication provider, ${providerType}, is not supported.`
        );
    }

    const { socialCallback } = req.settings;

    if (providerEnabled && socialCallback) {
      req.provider = provider;
      req.socialCallback = socialCallback;

      next();
    } else {
      next(
        new CustomError(
          401,
          `${providerType} authentication is not authorized for this account.`
        )
      );
    }
  };
};

export default authProvider;
