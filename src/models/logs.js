/**
 * Server logs for analytics to be stored in auth api db 
**/

const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const logSchema = new mongoose.Schema({
  request: {
    url: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    IP: {
      type:String,
      required: true
    },
    statusCode: {
      type: Number,
      required: true
    },
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  timestamp: true
});
 
logSchema.plugin(mongodbErrorHandler);

// remove _id and return id instead whenever log is retrieved from db
logSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Analytics", logSchema);
