const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const findOrCreate = require('mongoose-findorcreate');
const saltRounds = 10;
const { JWT_EXPIRE, JWT_SECRET } = require('../utils/config');


// Modified user model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    uniqueCaseInsensitive: true,
    required: [true, 'Please add a name'],
  },
  twoFactorAuth: {
    is2FA: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: null
    }
  },
  failedAttempts: {
    count: {
      type: Number,
      default: 0,
    },
    lastAttempt: {
      type: Date,
    },
  },
  email: {
    type: String,
    uniqueCaseInsensitive: true,
    required: [true, 'Please enter an email'],
  },
  password: {
    type: String,
    // required: [true, 'Please enter a Password'],
    minlength: 8,
    // select: false,
  },
  phone_number: {
    type: String,
    // required: [true, 'Please enter a phone number'],
    min: 10,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  facebookId: String,
  githubId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  twitter: String,
  github: String,
  tokens: Array,
  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String,
  },
  active: {
    type: Number,
    // 1 for active and 0 for not active
    enum: [0, 1],
    required: true,
    default: 1,
  },
});

userSchema.plugin(mongodbErrorHandler);
userSchema.plugin(findOrCreate);
// remove password, _id and return id instead whenever user is retrieved from db
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

userSchema.methods.matchPasswords = async function (enteredPassword) {
  // Match User Entered Password
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', function () {
  // Check if password is present and is modified, then hash
  const user = this;

  if (user.password && user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, saltRounds);
  }
});

userSchema.methods.generateToken = async function () {
  // Generate token for user session, and save to user schema in DB
  let user = this;
  const token = jwt.sign(user.id, JWT_SECRET);

  user.tokenExp = JWT_EXPIRE;
  user.token = token;
  return await user.save();
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;

  jwt.verify(token, 'secret', (err, decode) => {
    user.findOne({ _id: decode, token: token }, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};

module.exports = mongoose.model('User', userSchema);
