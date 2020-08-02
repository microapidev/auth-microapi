/**
 * Project reference to be stored in auth api db 
**/

const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const findOrCreate = require("mongoose-findorcreate");

const projectSchema = new mongoose.Schema({
  dbUrl: {
    type: String,
    required: true
  },
  timestamp: true
});
 
projectSchema.plugin(findOrCreate);
projectSchema.plugin(mongodbErrorHandler);

// remove _id and return id instead whenever project is retrieved from db
projectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Generate signed ACCESS KEY for admin to access a project's configurations
projectSchema.methods.generateACCESSKEY = () => RandomString.generate(64);

module.exports = mongoose.model("Project", projectSchema);
