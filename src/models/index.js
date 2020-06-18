const mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.Promise = Promise;

//Replace it with with mongodb-cluster
mongoose.connect('mongodb://localhost/auth-api', {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Database connected!!"))
    .catch(err => console.log(`Error: ${err}`));

module.exports.User = require('./user');