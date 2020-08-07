import OAuth from "oauth";

/**
 * This service is responsible for managing the OAuth Client for Twitter authentication.
 */
export default class TwitterService {
  authenticate(twitterAuthProvider, socialCallback) {
    this._socialCallback = socialCallback;
    this._consumerKey = twitterAuthProvider.consumerKey;
    this._consumerSecret = twitterAuthProvider.consumerSecret;
    this._initializeOAuthClient();
  }

  // Initialize the client.
  _initializeOAuthClient() {
    this._oauthClient = new OAuth.OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      this._consumerKey,
      this._consumerSecret,
      "1.0A",
      "http://localhost:5000/social/twitter/callback",
      "HMAC-SHA1"
    );
  }

  // Cache the client with the oauth_token.
  //
  // We cannot pass any state. So the oauth_token is the only identical
  // identifier across the states.
  _cacheOAuth2Client(oauth_token, oauth_token_secret) {
    cache[oauth_token] = {
      oauthClient: this._oauthClient,
      oauthTokenSecret: oauth_token_secret,
      socialCallback: this._socialCallback,
    };
  }

  async getAuthenticationUrl() {
    let outsideResolve;
    let outsideReject;
    const promise = new Promise(function (resolve, reject) {
      outsideResolve = resolve;
      outsideReject = reject;
    });

    try {
      // Get a request token.
      this._oauthClient.getOAuthRequestToken(
        (error, oauthToken, oauthTokenSecret) => {
          if (error) {
            outsideReject(error);
          }

          this._cacheOAuth2Client(oauthToken, oauthTokenSecret);
          outsideResolve(
            `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`
          );
        }
      );

      return promise;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async getData(oauth_token, oauth_verifier) {
    let outsideResolve;
    let outsideReject;
    const promise = new Promise(function (resolve, reject) {
      outsideResolve = resolve;
      outsideReject = reject;
    });

    try {
      const { oauthClient, oauthTokenSecret, socialCallback } = cache[
        oauth_token
      ];

      // Delete cached client.
      cache[oauth_token] = null;

      // Get an access token from the user's request token and verifier.
      oauthClient.getOAuthAccessToken(
        oauth_token,
        oauthTokenSecret,
        oauth_verifier,
        (error, oauthAccessToken, oauthAccessTokenSecret) => {
          if (error) {
            outsideReject(error);
          }

          // Get the user's credentials and profile information.
          oauthClient.get(
            "https://api.twitter.com/1.1/account/verify_credentials.json",
            oauthAccessToken,
            oauthAccessTokenSecret,
            (error, response) => {
              if (error) {
                outsideReject(error);
              }

              const responseJSON = JSON.parse(response);

              // Split the names so that we can get the first and last name.
              const names = responseJSON.name.split(" ");

              const profile = {
                twitterId: responseJSON.id_str,
                username: responseJSON.id_str,
                firstname: names[0],
                lastname: names.length > 0 ? names[names.length - 1] : null,
                email: null,
                isVerified: false,
                photo: responseJSON.profile_image_url,
              };

              const _data = {
                profile,
                socialCallback,
              };

              outsideResolve(_data);
            }
          );
        }
      );

      return promise;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

/**
 * This cache stores clients for use on the callback received from Twitter.
 */
const cache = {};
