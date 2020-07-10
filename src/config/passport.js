const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const { Strategy: TwitterStrategy } = require('passport-twitter');

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in with Twitter.
 */
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: `${process.env.BASE_URL}/callback`,
      passReqToCallback: true,
    },
    (req, accessToken, tokenSecret, profile, done) => {
      if (req.user) {
        User.findOne({ twitter: profile.id }, (err, existingUser) => {
          if (err) {
            return done(err);
          }
          if (existingUser) {
            done(err);
          } else {
            User.findById(req.user.id, (err, user) => {
              if (err) {
                return done(err);
              }
              user.twitter = profile.id;
              user.tokens.push({ kind: 'twitter', accessToken, tokenSecret });
              user.profile.name = user.profile.name || profile.displayName;
              user.profile.location =
                user.profile.location || profile._json.location;
              user.username = profile.displayName;

              user.profile.picture =
                user.profile.picture || profile._json.profile_image_url_https;
              user.save((err) => {
                if (err) {
                  return done(err);
                }
                done(err, user);
              });
            });
          }
        });
      } else {
        User.findOne({ twitter: profile.id }, (err, existingUser) => {
          if (err) {
            return done(err);
          }
          if (existingUser) {
            return done(null, existingUser);
          }
          const user = new User();
          // Twitter will not provide an email address.  Period.
          // But a person’s twitter username is guaranteed to be unique
          // so we can "fake" a twitter email address as follows:
          user.email = `${profile.username}@twitter.com`;
          user.twitter = profile.id;
          user.tokens.push({ kind: 'twitter', accessToken, tokenSecret });
          user.profile.name = profile.displayName;
          user.username = profile.displayName;
          user.profile.location = profile._json.location;
          user.profile.picture = profile._json.profile_image_url_https;
          user.save((err) => {
            done(err, user);
          });
        });
      }
    }
  )
);

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/')[2];
  const token = req.user.tokens.find((token) => token.kind === provider);
  if (token) {
    // Is there an access token expiration and access token expired?
    // Yes: Is there a refresh token?
    //     Yes: Does it have expiration and if so is it expired?
    //       Yes, Quickbooks - We got nothing, redirect to res.redirect(`/auth/${provider}`);
    //       No, Quickbooks and Google- refresh token and save, and then go to next();
    //    No:  Treat it like we got nothing, redirect to res.redirect(`/auth/${provider}`);
    // No: we are good, go to next():
    if (
      token.accessTokenExpires &&
      moment(token.accessTokenExpires).isBefore(moment().subtract(1, 'minutes'))
    ) {
      if (token.refreshToken) {
        if (
          token.refreshTokenExpires &&
          moment(token.refreshTokenExpires).isBefore(
            moment().subtract(1, 'minutes')
          )
        ) {
          res.redirect(`/auth/${provider}`);
        } else {
          refresh.requestNewAccessToken(
            `${provider}`,
            token.refreshToken,
            (err, accessToken, refreshToken, params) => {
              User.findById(req.user.id, (err, user) => {
                user.tokens.some((tokenObject) => {
                  if (tokenObject.kind === provider) {
                    tokenObject.accessToken = accessToken;
                    if (params.expires_in)
                    {tokenObject.accessTokenExpires = moment()
                      .add(params.expires_in, 'seconds')
                      .format();}
                    return true;
                  }
                  return false;
                });
                req.user = user;
                user.markModified('tokens');
                user.save((err) => {
                  if (err) {console.log(err);}
                  next();
                });
              });
            }
          );
        }
      } else {
        res.redirect(`/auth/${provider}`);
      }
    } else {
      next();
    }
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
