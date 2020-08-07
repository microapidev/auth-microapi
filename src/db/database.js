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
      return new Error(err.message);
    }
  } else {
    return new Error("Connection already Established");
  }
};

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  } else {
    return new Error("No open connection(s)");
  }
};

module.exports = {
  connect,
  disconnect,
};
