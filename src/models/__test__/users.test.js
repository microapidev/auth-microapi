const mongoose = require("mongoose");
const { connect, disconnect } = require("../../db");
const UserModel = require("../users");
const { userData, userDataIncomplete } = require("../__mocks__/user");
const transformUser = require("../../utils/models/transform-user");

describe("User model", () => {
  beforeAll(() => {
    connect(global.__MONGO_URI__);
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    disconnect();
  });

  test("Create and save user", async () => {
    const createdUser = new UserModel(userData);
    const savedUser = await createdUser.save();
    expect(savedUser).toEqual(createdUser);
    expect(savedUser).toMatchObject(userData);
  });

  test("Create fails with duplicate emails", async () => {
    const createdUser = new UserModel(userData);
    await createdUser.save();
    let err;
    try {
      await new UserModel(userData).save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.name).toEqual("MongoError");
    expect(err.message).toMatch(new RegExp(userData.email));
  });

  test("Create fails without required fields", async () => {
    let err;
    const createdUser = new UserModel(userDataIncomplete);
    try {
      await createdUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  test("Create discards invalid fields", async () => {
    const userDataInvalid = new UserModel({
      ...userData,
      create: "fails",
    });
    const savedUserDataInvalid = await userDataInvalid.save();
    expect(savedUserDataInvalid).toMatchObject(userData);
    expect(savedUserDataInvalid.create).toBeUndefined();
  });

  test("Transform user document", async () => {
    const createdUser = new UserModel(userData);
    const properties = ["_id", "__v", "password"];
    await createdUser.validate();
    properties.forEach((property) => {
      expect(createdUser).toHaveProperty(property);
    });
    properties.forEach((property) => {
      expect(
        createdUser.toObject({ transform: transformUser })
      ).not.toHaveProperty(property);
      expect(
        createdUser.toJSON({ transform: transformUser })
      ).not.toHaveProperty(property);
    });
  });
});
