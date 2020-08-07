const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IndexSchema = new Schema({
  name: {
    type: String,
    default: "A name",
  },
});

module.exports = mongoose.model("Index", IndexSchema);
