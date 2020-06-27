const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose
  .connect(
    'mongodb+srv://Alkaseem:Alkaseem123@cluster0-q61lz.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  )
  .then(() => console.log('Database connected!!'))
  .catch((err) => console.log(`Error: ${err}`));

module.exports.User = require('./user');
