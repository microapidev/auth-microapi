/**
 * A representation of an authenticating user
 * @module models
 * @author piouson <https://github.com/piouson>
 */
const mongooose = require("mongoose");
const transformUser = require("../utils/models/transform-user");

/**
 * User schema
 * @constructor User
 */
const userSchema = new mongooose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    phone: {
      type: String,
    },
    otp: {
      isEnabled: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
      },
    },
    authProvider: [
      {
        authId: {
          type: String,
        },
        authType: {
          type: String,
          enum: ["facebook", "github", "google", "twitter"],
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      count: {
        type: Number,
        default: 0,
      },
      lastAttempt: {
        type: Date,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: transformUser,
    },
    toJSON: {
      transform: transformUser,
    },
  }
);

module.exports = mongooose.model("User", userSchema);
