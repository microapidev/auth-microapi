const mongoose = require("mongoose");

const connect = async (connectionUri) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(connectionUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log(`Error Connecting to DB: ${err.stack}`);
      process.exit(1);
    }
  }
};

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = {
  connect,
  disconnect,
};
