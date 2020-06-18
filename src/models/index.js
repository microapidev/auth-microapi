const mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.Promise = Promise;
// const DB_URL = process.env.DB_URL;

//Replace it with with mongodb-cluster
// mongoose.connect('mongodb://localhost/auth-api', {
//         keepAlive: true,
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => console.log("Database connected!!"))
//     .catch(err => console.log(`Error: ${err}`));

mongoose.connect("mongodb+srv://Alkaseem:Alkaseem123@cluster0-q61lz.mongodb.net/<dbname>?retryWrites=true&w=majority", {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log("Database connected!!"))
    .catch(err => console.log(`Error: ${err}`));


module.exports.User = require('./user');