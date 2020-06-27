const mongoose = require("mongoose");

// Modified user model
const ApiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, "Key is required"],
  },
  createdBy: {
    type: String,
    required: [true, "Admin ID is required."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  usageCount: {
    type: [{}],
  },
});

const ApiKey = mongoose.model("ApiKey", ApiKeySchema);

ApiKeySchema.methods.generateKey = function (cb) {
  const apiKey = this;
  const randomString = (length) => {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  apiKey.key = randomString(100);

  apiKey.save((err, apiKey) => {
    if (err) {
      return cb(err);
    }
    cb(null, apiKey);
  });
};

module.exports = { ApiKey };
