import querystring from "querystring";
import axios from "axios";

/**
 * This service is responsible for managing the OAuth Client for Facebook authentication.
 */
export default class FacebookService {
  authenticate(facebookAuthProvider, socialCallback) {
    this._socialCallback = socialCallback;
    this._appID = facebookAuthProvider.appID;
    this._appSecret = facebookAuthProvider.appSecret;
    this._cacheOAuth2Client();
  }

  // Cache the client.
  _cacheOAuth2Client() {
    cache[this._appID] = {
      oauth2Client: {
        appID: this._appID,
        appSecret: this._appSecret,
      },
      socialCallback: this._socialCallback,
    };
  }

  getAuthenticationUrl() {
    const stringifiedParams = querystring.stringify({
      client_id: this._appID,
      redirect_uri: `${process.env.HOST}/social/facebook/callback`,
      scope: ["email", "public_profile"].join(","), // comma seperated string
      response_type: "code",
      auth_type: "rerequest",
      display: "popup",
      state: this._appID,
    });

    return `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
  }

  async getData(appID, code) {
    try {
      const { oauth2Client, socialCallback } = cache[appID];

      // Delete cached client.
      cache[appID] = null;

      const tokenResponse = await axios({
        url: "https://graph.facebook.com/v4.0/oauth/access_token",
        method: "get",
        params: {
          client_id: oauth2Client.appID,
          client_secret: oauth2Client.appSecret,
          redirect_uri: `${process.env.HOST}/social/facebook/callback`,
          code,
        },
      });

      const userResponse = await axios({
        url: "https://graph.facebook.com/me",
        method: "get",
        params: {
          fields: [
            "id",
            "email",
            "first_name",
            "last_name",
            "picture.type(large)",
          ].join(","),
          access_token: tokenResponse.data.access_token,
        },
      });

      return {
        profile: {
          facebookId: userResponse.data.id,
          username: userResponse.data.email,
          firstname: userResponse.data.first_name,
          lastname: userResponse.data.last_name,
          isVerified: false,
          email: userResponse.data.email,
          photo: userResponse.data.picture.data.url,
        },
        socialCallback,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

/**
 * This cache stores clients for use on the callback received from Facebook.
 */
const cache = {};
