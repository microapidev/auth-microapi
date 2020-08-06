const IndexModel = require("../../models/index");
const { connect, disconnect } = require("../database");
const log = require("debug")("log");
const mongoose = require("mongoose");

describe("INSERT", () => {
  test("Should confirm mongodb works by adding a record", async () => {
    log("Attempting to connect to database...");
    await connect();
    log("Database connected successfully");

    const id = mongoose.Types.ObjectId();
    const mockData = new IndexModel({
      _id: id,
      name: "Oscar",
    });
    await mockData.save();

    const insertedData = await IndexModel.findById(id);
    expect(insertedData.id).toEqual(mockData.id);
    expect(insertedData.name).toEqual(mockData.name);

    await disconnect();
  });
});
