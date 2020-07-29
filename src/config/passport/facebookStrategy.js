const passport = require("passport");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const User = require("../../models/user");
const SessionManagement = require("../../services/SessionManagement");

/**
 * Sign in with Facebook.
 */
const createFacebookStrategy = (appID, appSecret) => {
  return new FacebookStrategy(
    {
      clientID: appID || process.env.FACEBOOK_APP_ID,
      clientSecret: appSecret || process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.HOST}/api/facebook/callback`,
      profileFields: ["name", "email", "link", "locale", "timezone", "gender"],
      passReqToCallback: true,
    },
    callback
  );
};

const callback = (req, accessToken, refreshToken, profile, done) => {
  console.log(profile);

  if (req.user) {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) {
        return done(err);
      }
      if (existingUser) {
        SessionManagement.login(req, existingUser);

        done(err, existingUser);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) {
            return done(err);
          }
          user.facebook = profile.id;
          user.email = profile._json.email;
          user.username = `${profile.name.givenName} ${profile.name.familyName}`;
          user.tokens.push({ kind: "facebook", accessToken });
          user.profile.name =
            user.profile.name ||
            `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture =
            user.profile.picture ||
            `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.save((err) => {
            SessionManagement.login(req, user);

            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) {
        return done(err);
      }
      if (existingUser) {
        SessionManagement.login(req, existingUser);

        return done(null, existingUser);
      }
      const user = new User();
      user.email = profile._json.email;
      user.facebook = profile.id;
      user.username = `${profile.name.givenName} ${profile.name.familyName}`;

      user.tokens.push({ kind: "facebook", accessToken });
      user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
      user.profile.gender = profile._json.gender;
      user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
      user.profile.location = profile._json.location
        ? profile._json.location.name
        : "";
      user.save((err) => {
        SessionManagement.login(req, existingUser);
        done(err, user);
      });
    });
  }
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = createFacebookStrategy;
