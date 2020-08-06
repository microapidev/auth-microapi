const mongoose = require("mongoose");
const IndexModel = require("../../models/index");
const { connect, disconnect } = require("../database");
require("dotenv").config();

describe("INSERT", () => {
  test("Should confirm mongodb works by adding a record", async () => {
    console.log("Attempting to connect to database...");
    await connect(process.env.AUTH_API_MONGODB_URI);
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

  test("Should catch connection string error", async () => {
    console.log("Attempting to connect to database...");
    expect(await connect("")).toEqual(Error("Invalid connection string"));
  });

  test("Should return error for existing connections", async () => {
    console.log("Attempting to connect to database...");
    mongoose.connection.readyState = 1;
    expect(await connect(process.env.AUTH_API_MONGODB_URI)).toEqual(
      Error("Connection already Established")
    );
  });

  test("Should return error for non-existing connections on disconnec", async () => {
    console.log("Attempting to connect to database...");
    await connect(process.env.AUTH_API_MONGODB_URI);
    mongoose.connection.readyState = 0;
    expect(await disconnect()).toEqual(Error("No open connection(s)"));
  });
});
