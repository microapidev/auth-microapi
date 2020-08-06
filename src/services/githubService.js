/**
 * This service is responsible for managing the OAuth Client for GitHub authentication.
 */
export default class GitHubService {
  constructor(githubAuthProvider) {
    this._clientID = githubAuthProvider.clientID;
    this._clientSecret = githubAuthProvider.clientSecret;
  }

  getAuthenticationUrl() {
    throw new Error("Unimplemented");
  }
}
