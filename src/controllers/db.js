const mongoose = require("mongoose");

mongoose.set("debug", true);
mongoose.Promise = Promise;

const DB_URI = process.env.DB_URL; //|| 'mongodb+srv://Alkaseem:Alkaseem123@cluster0-q61lz.mongodb.net/micro-api-auth?retryWrites=true&w=majority';
exports.connectDB = () => {
<<<<<<< HEAD
  console.log(DB_URI);
  mongoose.connect(DB_URI, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
    .then(() => console.log('Database connected!!'))
=======
  mongoose
    .connect(
      process.env.MONGO_URL ||
        "mongodb+srv://Alkaseem:Alkaseem123@cluster0-q61lz.mongodb.net/micro-api-auth?retryWrites=true&w=majority",
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    )
    .then(() => console.log("Database connected!!"))
>>>>>>> upstream/develop
    .catch((err) => console.log(`Error: ${err}`));
};
