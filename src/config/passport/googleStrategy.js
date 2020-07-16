const passport = require('passport');
const GoogleUser = require('../../models/googleUser');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      GoogleUser.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) {
          return done(err);
        }
        // Check if the user is available
        if (!user) {
          let newUser = new GoogleUser({
            googleId: profile.id,
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
            console.log('===New=Google=Profile===');
            return done(err, newUser);
          });
        } else {
          console.log('===Existing=Google=Profile===');
          // console.log(user);
          return done(err, user);
        }
      });
    }
  )
);
// Persist the user
passport.serializeUser(GoogleUser.serializeUser());
passport.deserializeUser(GoogleUser.deserializeUser());
  