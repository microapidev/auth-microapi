/**
 * This service is responsible for managing the OAuth Client for Facebook authentication.
 */
export default class FacebookService {
  authenticate(facebookAuthProvider, socialCallback) {
    this._socialCallback = socialCallback;
    this._appID = facebookAuthProvider.appID;
    this._appSecret = facebookAuthProvider.appSecret;
  }

  getAuthenticationUrl() {
    throw new Error("Unimplemented");
  }
}
