const mongoose = require("mongoose");
const { connect, disconnect } = require("../../db");
const UserModel = require("../users");
const { userData, userDataIncomplete } = require("../__mocks__/user");

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
});
