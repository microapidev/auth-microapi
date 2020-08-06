import { google } from "googleapis";

/**
 * This service is responsible for managing the OAuth Client for Google authentication.
 */
export default class GoogleService {
  authenticate(googleAuthProvider, socialCallback) {
    this._socialCallback = socialCallback;
    this._clientID = googleAuthProvider.clientID;
    this._clientSecret = googleAuthProvider.clientSecret;
    this._initializeOAuth2Client();
    this._cacheOAuth2Client();
  }

  // Initialize the client.
  _initializeOAuth2Client() {
    this.oauth2Client = new google.auth.OAuth2(
      this._clientID,
      this._clientSecret,
      `${process.env.HOST}/social/google/callback`
    );
  }

  // Cache the client.
  _cacheOAuth2Client() {
    oauth2ClientsCache[this._clientID] = {
      oauth2Client: this.oauth2Client,
      socialCallback: this._socialCallback,
    };
  }

  // Returns scopes for a Google user's information and email address.
  _getScopes() {
    return [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
  }

  // Returns a authentication URL that will initiate Google's authentication flow through their servers.
  getAuthenticationUrl() {
    return this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",

      // If you only need one scope you can pass it as a string
      scope: this._getScopes(),

      // Add the client ID to ensure the correnct credentials are used on server response (callback)
      state: this._clientID,
    });
  }

  // Returns the formatted profile of the authenticated Google user and a redirect callback.
  async getData(clientID, code) {
    try {
      const cachedClient = oauth2ClientsCache[clientID];

      // Delete cached client.
      oauth2ClientsCache[clientID] = null;

      const { tokens } = await cachedClient.oauth2Client.getToken(code);
      cachedClient.oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: cachedClient.oauth2Client,
        version: "v2",
      });

      const res = await oauth2.userinfo.get();

      console.log(res);

      const profile = {
        googleId: res.data.id,
        username: res.data.email,
        firstname: res.data.given_name,
        lastname: res.data.family_name,
        email: res.data.email,
        isVerified: res.data.verified_email,
        photo: res.data.picture,
      };

      return {
        profile,
        socialCallback: cachedClient.socialCallback,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

/**
 * This cache stores clients for use on the callback received from Google.
 */
const oauth2ClientsCache = {};
