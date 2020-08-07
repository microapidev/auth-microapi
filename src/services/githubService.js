import axios from "axios";

/**
 * This service is responsible for managing the OAuth Client for GitHub authentication.
 */
export default class GitHubService {
  authenticate(githubAuthProvider, socialCallback) {
    this._socialCallback = socialCallback;
    this._clientID = githubAuthProvider.clientID;
    this._clientSecret = githubAuthProvider.clientSecret;
    this._cacheOAuth2Client();
  }

  // Cache the client.
  _cacheOAuth2Client() {
    cache[this._clientID] = {
      oauth2Client: {
        clientID: this._clientID,
        clientSecret: this._clientSecret,
      },
      socialCallback: this._socialCallback,
    };
  }

  getAuthenticationUrl() {
    return `https://github.com/login/oauth/authorize?client_id=${this._clientID}&state=${this._clientID}&scope=read:user, user:email`;
  }

  async getData(clientID, code) {
    try {
      const { oauth2Client, socialCallback } = cache[clientID];

      // Delete cached client.
      cache[clientID] = null;

      // Request a user's access token using the authorization code.
      const tokenResponse = await axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token?client_id=${oauth2Client.clientID}&client_secret=${oauth2Client.clientSecret}&code=${code}`,
        // Set the content type header, so that we get the response in JSON
        headers: {
          accept: "application/json",
        },
      });

      // Request a user's profile information using their access token.
      const userResponse = await axios({
        method: "get",
        url: "https://api.github.com/user",
        // Set the content type header, so that we get the response in JSON
        headers: {
          authorization: `token ${tokenResponse.data.access_token}`,
        },
      });

      // Split the names so that we can get the first and last name.
      const names = userResponse.data.name.split(" ");

      const profile = {
        githubId: userResponse.data.id,
        username: userResponse.data.login,
        firstname: names[0],
        lastname: names[names.length - 1],
        email: userResponse.data.email,
        isVerified: false,
        photo: userResponse.data.avatar_url,
      };

      return {
        profile,
        socialCallback,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

/**
 * This cache stores clients for use on the callback received from GitHub.
 */
const cache = {};
