export const testFlags = {
  disableFacebook: false,
  disableGoogle: false,
  disableGithub: false,
  disableTwitter: false,
};

// Test Data
const testSettings = () => {
  return {
    facebookAuthProvider: {
      appID: testFlags.disableFacebook
        ? null
        : process.env.FACEBOOK_APP_ID || "629016041331396",
      appSecret: testFlags.disableFacebook
        ? null
        : process.env.FACEBOOK_APP_SECRET || "0ea9fb7b258f79eb77062ef8fe695860",
    },
    googleAuthProvider: {
      clientID: testFlags.disableGoogle
        ? null
        : process.env.GOOGLE_CLIENT_ID ||
          "890926583937-5rv8t479let7iq2mofp3iumv4k9q83sc.apps.googleusercontent.com",
      clientSecret: testFlags.disableGoogle
        ? null
        : process.env.GOOGLE_CLIENT_SECRET || "UcATfElogefVlYPHUGJydVef",
    },
    githubAuthProvider: {
      clientID: testFlags.disableGithub
        ? null
        : process.env.GITHUB_CLIENT_ID || "457470f0d7bc6d16fe22",
      clientSecret: testFlags.disableGithub
        ? null
        : process.env.GITHUB_CLIENT_SECRET ||
          "a1448a4e4bd6fdad7772e30d1c1e5fedfcb9694a",
    },
    twitterAuthProvider: {
      consumerKey: testFlags.disableTwitter
        ? null
        : process.env.TWITTER_CONSUMER_KEY || "xfZYJR3PWKjeWUavEIIjWFoAR",
      consumerSecret: testFlags.disableTwitter
        ? null
        : process.env.TWITTER_CONSUMER_SECRET ||
          "iDwdmGAm7SYhfGLoISAvLl7io4X1Eg1WoOkWNwaDv5ShqMzuvz",
    },
    socialCallback: `${process.env.HOST}/social/authCallback`,
  };
};

export default testSettings;
