const IndexModel = require("../../models/index");
const { connect, disconnect } = require("../database");
const mongoose = require("mongoose");
require("dotenv").config();

describe("INSERT", () => {
  test("Should confirm mongodb works by adding a record", async () => {
    console.log("Attempting to connect to database...");
    await connect(process.env.DB_URI);
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
