const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const findOrCreate = require("mongoose-findorcreate");
// const moment = require('moment');
const saltRounds = 10;
const {
  JWT_SECRET,
  JWT_ADMIN_SECRET,
  AUTH_API_DB,
} = require("../utils/config");

// Admin model to be stored in user db
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    uniqueCaseInsensitive: true,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    uniqueCaseInsensitive: true,
    required: [true, "Please enter an email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a Password"],
    minlength: 8,
    // select: false,
  },
  phone_number: {
    type: String,
    required: [true, "Please enter a phone number"],
    min: 10,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Settings",
  },
});
adminSchema.plugin(findOrCreate);
adminSchema.plugin(mongodbErrorHandler);

// remove password, _id and return id instead whenever user is retrieved from db
adminSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

adminSchema.methods.matchPasswords = async function (enteredPassword) {
  // Match User Entered Password
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre("save", function () {
  // Check if password is present and is modified, then hash
  const user = this;

  // commented to allow hashing of password on password reset
  // if (user.password && user.isModified('password')) {
  if (user.password) {
    user.password = bcrypt.hashSync(user.password, saltRounds);
  }
});

adminSchema.methods.generateACCESSKEY = function () {
  // Generate signed ACCESS KEY for admin
  const admin = this;
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      DBURI: AUTH_API_DB,
    },
    JWT_ADMIN_SECRET
  );
};

adminSchema.statics.findByToken = function (token, cb) {
  const user = this;

  jwt.verify(token, JWT_SECRET, (err, decode) => {
    if (err) {
      return cb(err);
    }
    user.findOne({ id: decode, token }, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};

module.exports = mongoose.model("admin", adminSchema);
