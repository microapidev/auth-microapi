/**
 * This service is responsible for managing the OAuth Client for Twitter authentication.
 */
export default class TwitterService {
  authenticate(twitterAuthProvider, socialCallback) {
    this._socialCallback = socialCallback;
    this._consumerKey = twitterAuthProvider.consumerKey;
    this._consumerSecret = twitterAuthProvider.consumerSecret;
  }

  getAuthenticationUrl() {
    throw new Error("Unimplemented");
  }
}
