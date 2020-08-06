/**
 * This service is responsible for managing the OAuth Client for GitHub authentication.
 */
export default class GitHubService {
  authenticate(githubAuthProvider, socialCallback) {
    this._socialCallback = socialCallback;
    this._clientID = githubAuthProvider.clientID;
    this._clientSecret = githubAuthProvider.clientSecret;
  }

  getAuthenticationUrl() {
    throw new Error("Unimplemented");
  }
}
