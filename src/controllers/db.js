const { AUTH_API_DB } = require('../utils/config');
const mongoose = require('mongoose');
mongoose.set('debug', true);

const connectDB = () => {
  console.log('Connecting to database...');

  mongoose.connect(
    AUTH_API_DB,
    {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      poolSize: 10
    }
  )
    .then(database => {
      global.DB = database;
      console.log('Connected to Auth-MicroAPI database!');
    })
    .catch(error => {
      console.error.bind(console, 'MongoDB Connection Error>> : ');
    });
};

module.exports = {
  connectDB
};