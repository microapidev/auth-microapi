const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const findOrCreate = require('mongoose-findorcreate');
// const moment = require('moment');
const saltRounds = 10;
const { JWT_EXPIRE, JWT_SECRET, JWT_ADMIN_SECRET } = require('../utils/config');

// Modified user model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    uniqueCaseInsensitive: true,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    uniqueCaseInsensitive: true,
    required: [true, 'Please enter an email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a Password'],
    minlength: 8,
    // select: false,
  },
  phone_number: {
    type: String,
    required: [true, 'Please enter a phone number'],
    min: 10,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.plugin(findOrCreate);
userSchema.plugin(mongodbErrorHandler);

// remove password, _id and return id instead whenever user is retrieved from db
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.password;
  }
});

userSchema.methods.matchPasswords = async function (enteredPassword) {
  // Match User Entered Password
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', function () {
  // Check if password is present and is modified, then hash
  const user = this;

  // commented to allow hashing of password on password reset
  // if (user.password && user.isModified('password')) {
  if (user.password) {
    user.password = bcrypt.hashSync(user.password, saltRounds);
  }
});

userSchema.methods.generateAPIKEY = function () {
  // Generate signed API KEY for admin
  const admin = this;
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      DBURI: APP_DB
    },
    JWT_ADMIN_SECRET
  );
};

userSchema.statics.findByToken = function (token, cb) {
  const user = this;

  jwt.verify(token, JWT_SECRET, (err, decode) => {
    if (err) {
      return cb(err);
    };
    user.findOne({ id: decode, token }, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};

module.exports = mongoose.model('adminUser', userSchema);
