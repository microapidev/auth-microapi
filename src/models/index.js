<<<<<<< Updated upstream
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IndexSchema = new Schema({
  name: {
    type: String,
    default: "A name",
  },
});

module.exports = mongoose.model("Index", IndexSchema);
=======
const UserModel = require("./users");

module.exports = {
  UserModel,
};
>>>>>>> Stashed changes
