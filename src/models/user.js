const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    IsAdmin: false
}, {
    timestamps: true
});

/* Password encryption 

use bcrypt node package manager to encrypt the user password */
 
userSchema.pre('save', async function(next) {
    try { 
    //   // Generate a salt
      const salt = await bcrypt.genSalt(10);
    //   // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(this.password, salt);
    //   // Re-assign hashed version over original, plain text password
      this.password = passwordHash; 
      next();
    } catch(error) {
      next(error);
    }
  });


userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    var token =  jwt.sign(user._id.toHexString(),'secret')
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    user.save(function (err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    jwt.verify(token,'secret',function(err, decode){
        user.findOne({"_id":decode, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}


const User = mongoose.model('User', userSchema);

module.exports = User;