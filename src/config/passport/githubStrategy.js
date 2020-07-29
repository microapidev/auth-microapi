const { Strategy: GitHubStrategy } = require("passport-github2");
const User = require("../../models/user");
const _ = require("lodash");
const passport = require("passport");
const SessionManagement = require("../../services/SessionManagement");

/**
 * Sign in with GitHub.
 */
const createGithubStrategy = (clientID, clientSecret) => {
  return new GitHubStrategy(
    {
      clientID: clientID || process.env.GITHUB_CLIENT_ID,
      clientSecret: clientSecret || process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/api/github/callback`,
      passReqToCallback: true,
      scope: ["user:email"],
    },
    callback
  );
};

const callback = (req, accessToken, refreshToken, profile, done) => {
  User.findOne({ twitter: profile.id }, (err, existingUser) => {
    if (err) {
      return done(err);
    }
    if (existingUser) {
      SessionManagement.login(req, existingUser);
      return done(null, existingUser);
    }
    const user = new User();
    // Twitter will not provide an email address.  Period.
    // But a person’s twitter username is guaranteed to be unique
    // so we can "fake" a twitter email address as follows:
    user.email = _.get(
      _.orderBy(profile.emails, ["primary", "verified"], ["desc", "desc"]),
      [0, "value"],
      null
    );

    user.github = profile.id;
    user.tokens.push({ kind: "github", accessToken });
    user.profile.name = profile.displayName;
    user.username = profile.displayName;
    user.profile.name = user.profile.name || profile.displayName;
    user.profile.picture = user.profile.picture || profile._json.avatar_url;
    user.profile.location = user.profile.location || profile._json.location;
    user.profile.website = user.profile.website || profile._json.blog;

    user.save((err) => {
      SessionManagement.login(req, new Object(user));

      return done(err, user);
    });
  });
};

// use static serialize and deserialize of model for passport session support
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = createGithubStrategy;
