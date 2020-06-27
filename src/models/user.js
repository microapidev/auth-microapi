const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require('moment');

// Modified user model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
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
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// hashing password
// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// Match User Entered Password
userSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

userSchema.pre('save', function save(next) {
  const user = this;

  // check if password is present and is modified.
  if (user.password && user.isModified('password')) {
    // call your hashPassword method here which will return the hashed password.
    user.password = bcrypt.hashSync(user.password, 10);
  }
  // everything is done, so let's call the next callback.
  next();
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.methods.generateAPIKEY = function () {
  const admin = this;
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      DBURI: process.env.MONGO_URL,
      role: String(admin.role),
    },
    process.env.JWT_SECRET
  );
};

userSchema.methods.generateToken = function (cb) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), 'secret');
  const oneHour = moment().add(1, 'hour').valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save((err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  const user = this;

  jwt.verify(token, 'secret', (err, decode) => {
    user.findOne({ _id: decode, token }, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};
const User = mongoose.model('User', userSchema);

module.exports = { User };
