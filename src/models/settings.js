const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const findOrCreate = require("mongoose-findorcreate");

// Subschema for the Facebook authentication provider credentials.
const FacebookAuthProviderCredentialsSchema = new mongoose.Schema({});

// Subschema for the Twitter authentication provider credentials.
const TwitterAuthProviderCredentialsSchema = new mongoose.Schema({});

// Subschema for the Google authentication provider credentials.
const GoogleAuthProviderCredentialsSchema = new mongoose.Schema({});

// Subschema for the GitHub authentication provider credentials.
const GitHubAuthProviderCredentialsSchema = new mongoose.Schema({});

// Settings model
const settingsSchema = new mongoose.Schema({
  facebookAuthProvider: {
    appId: {
      type: String,
    },
    appSecret: {
      type: String,
    },
  },
  twitterAuthProvider: {
    key: {
      type: String,
    },
    secret: {
      type: String,
    },
  },
  githubAuthProvider: {
    clientId: {
      type: String,
    },
    clientSecret: {
      type: String,
    },
  },
  googleAuthProvider: {
    clientId: {
      type: String,
    },
    clientSecret: {
      type: String,
    },
  },
});

settingsSchema.plugin(findOrCreate);
settingsSchema.plugin(mongodbErrorHandler);

// remove password, _id and return id instead whenever user is retrieved from db
settingsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
