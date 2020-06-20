const connectDB = () => {
    const mongoose = require("mongoose");
    mongoose.set('debug', true);
    mongoose.Promise = Promise;
    // // const DB_URL = process.env.DB_URL;

    // //Replace it with with mongodb-cluster
    // mongoose.connect('mongodb://localhost:27017/authapi', {
    //         keepAlive: true,
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useCreateIndex:true
    //     })
    //     .then(() => console.log("Database connected!!"))
    //     .catch(err => console.log(`Error: ${err}`));

    mongoose.connect(process.env.DB_URL, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => console.log("Database connected!!"))
        .catch(err => console.log(`Error: ${err}`));
};


module.exports = connectDB;
// module.exports.User = require('../models/user');