const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"]

  },
  email: {
    type: String,
    required: [true, "Please enter an email"]
  },
  password: {
    type: String,
    required: [true, "Please enter a Password"],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    required: true,
    enum: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// hashing password
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

//Sign JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({id: this._id},process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match User Entered Password
userSchema.methods.matchPasswords = async function (enteredPassword) {
return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
