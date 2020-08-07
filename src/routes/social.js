import express from "express";
import { authProviderMW } from "../middleware";
import { socialControllers } from "../controllers";
import {
  FACEBOOK_PROVIDER,
  GITHUB_PROVIDER,
  GOOGLE_PROVIDER,
  TWITTER_PROVIDER,
} from "../middleware/authProviderMW";

const socialRouter = express.Router();

// Test route for the socialAuthCallback
socialRouter.get("/authCallback", (req, res) => {
  console.log(req.query);
  res.json({ message: "OK" });
});

/**
 * Authenticate with Facebook route.
 */
socialRouter.get(
  "/facebook",
  authProviderMW(FACEBOOK_PROVIDER),
  socialControllers.facebookController
);

/**
 * Authenticate with GitHub route.
 */
socialRouter.get(
  "/github",
  authProviderMW(GITHUB_PROVIDER),
  socialControllers.githubController
);

/**
 * Authenticate with Google route.
 */
socialRouter.get(
  "/google",
  authProviderMW(GOOGLE_PROVIDER),
  socialControllers.googleController
);

/**
 * Authenticate with Twitter route.
 */
socialRouter.get(
  "/twitter",
  authProviderMW(TWITTER_PROVIDER),
  socialControllers.twitterController
);

/**
 * Facebook authentication callback route.
 */
socialRouter.get("/facebook/callback");

/**
 * GitHub authentication callback route.
 */
socialRouter.get(
  "/github/callback",
  socialControllers.githubCallbackController
);

/**
 * Google authentication callback route.
 */
socialRouter.get(
  "/google/callback",
  socialControllers.googleCallbackController
);

/**
 * Twitter authentication callback route.
 */
socialRouter.get(
  "/twitter/callback",
  socialControllers.twitterCallbackController
);

export default socialRouter;
