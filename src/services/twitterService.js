/**
 * This service is responsible for managing the OAuth Client for Twitter authentication.
 */
export default class TwitterService {
  constructor(twitterAuthProvider) {
    this._consumerKey = twitterAuthProvider.consumerKey;
    this._consumerSecret = twitterAuthProvider.consumerSecret;
  }

  getAuthenticationUrl() {
    throw new Error("Unimplemented");
  }
}
