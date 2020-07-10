


const userModel = require("../models/user");

const { ErrorResponse } = require("../utils/errors");


const last30DAys = Date.now() - 30;

const user = {
getNewlyRegisteredUsers: async (req, res) => {
    try {
      const users = await userModel
        .find({createdAt:{default:{$lte: last30DAys}}})
        .select(["profile"]);
      res.json({
        status: "Success",
        message: "List of active users",
        data: users,
      });
    } catch (err) {
      ErrorResponse(err, res);
    }
  },
getActiveUsers: async (req, res) => {
  try {
    const users = await userModel
      .find({ active: {dateActivated:{$lte: last30DAys }}})
      .select(["profile"]);
    res.json({
      status: "Success",
      message: "List of active users",
      data: users,
    });
  } catch (err) {
    ErrorResponse(err, res);
  }
}

};


  module.exports = user;
