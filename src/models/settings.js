/**
 * Project based settings and configuration 
**/

const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const findOrCreate = require("mongoose-findorcreate");
require('mongoose-schema-jsonschema')(mongoose); // allows to create accessible json object based on schema, negating need to store model defaults in database

// Settings model: default stored in auth
const settingsSchema = new mongoose.Schema({
  emailVerification: {
    successCallbackUrl: {
      type: String,
      default: null,
    },
    failureCallbackUrl: {
      type: String,
      default: null,
    }
  },
  passwordReset: {
    successCallbackUrl: {
      type: String,
      default: null,
    },
    failureCallbackUrl: {
      type: String,
      default: null,
    }
  },
  socialAuth: {
    successCallbackUrl: {
      type: String,
      default: null,
    },
    failureCallbackUrl: {
      type: String,
      default: null,
    }
  },
  facebookAuthProvider: {
    appID: {
      type: String,
      default: null,
    },
    appSecret: {
      type: String,
      default: null,
    },
  },
  twitterAuthProvider: {
    key: {
      type: String,
      default: null,
    },
    secret: {
      type: String,
      default: null,
    },
  },
  githubAuthProvider: {
    clientID: {
      type: String,
      default: null,
    },
    clientSecret: {
      type: String,
      default: null,
    },
  },
  googleAuthProvider: {
    clientID: {
      type: String,
      default: null,
    },
    clientSecret: {
      type: String,
      default: null,
    },
  }
});

settingsSchema.plugin(findOrCreate);
settingsSchema.plugin(mongodbErrorHandler);

// remove password, _id and return id instead whenever user is retrieved from db
settingsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const jsonSchema = settingsSchema.jsonSchema();
 
// console.dir(jsonSchema, { depth: null });

module.exports = mongoose.model("Settings", settingsSchema);
