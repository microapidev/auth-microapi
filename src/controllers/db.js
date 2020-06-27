const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = Promise;

exports.connectDB = () => {
  mongoose
    .connect(
      process.env.MONGO_URL ||
        'mongodb+srv://Alkaseem:Alkaseem123@cluster0-q61lz.mongodb.net/micro-api-auth?retryWrites=true&w=majority',
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    )
    .then(() => console.log('Database connected!!'))
    .catch((err) => console.log(`Error: ${err}`));
};
