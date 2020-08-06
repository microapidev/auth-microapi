let mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");
//create a schema
let userSchema = new mongoose.Schema({
  googleId: String,
  photo: String,
  username: String,
  firstname: String,
  lastname: String,
  email: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);
let GoogleUser = mongoose.model("GoogleUser", userSchema);

//export for use in route
module.exports = GoogleUser;
