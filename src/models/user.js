const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

// Modified user model
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



// Match User Entered Password
userSchema.methods.matchPasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Sign JWT
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};



const User = mongoose.model('User', userSchema);

module.exports = User;