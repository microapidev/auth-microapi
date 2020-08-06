const passport = require("passport");
const GoogleUser = require("../../models/googleUser");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const createGoogleStrategy = (provider) => {
  let clientID = "noID";
  let clientSecret = "noSecret";

  if (provider && provider.clientID) {
    clientID = provider.clientID;
    clientSecret = provider.clientSecret;
  }

  return new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${process.env.HOST}/api/google/callback`,
    },
    callback
  );
};

const callback = (accessToken, refreshToken, profile, done) => {
  GoogleUser.findOne({ email: profile.emails[0].value }, (err, user) => {
    if (err) {
      return done(err);
    }

    let photo = null;

    if (profile.photos.length > 0) {
      photo = profile.photos[0].value;
    }

    // Check if the user is available
    if (!user) {
      let newUser = new GoogleUser({
        googleId: profile.id,
        photo: photo,
        username: profile.displayName.trim(),
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value,
        isVerified: profile.emails[0].verified,
      });

      newUser.save((err) => {
        if (err) {
          console.log(err);
        }
        return done(err, newUser);
      });
    } else {
      if (user.photo) {
        return done(err, user);
      }

      GoogleUser.updateOne(
        { googleId: user.googleId },
        { $set: { photo: photo } },
        (err, googleUser) => {
          if (err) {
            console.log(err);
          } else {
            return done(err, googleUser);
          }
        }
      );
    }
  });
};

// Persist the user
passport.serializeUser(GoogleUser.serializeUser());
passport.deserializeUser(GoogleUser.deserializeUser());

module.exports = createGoogleStrategy;
