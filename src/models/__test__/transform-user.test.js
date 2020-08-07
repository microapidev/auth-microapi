const { userData } = require("../__mocks__/user");
const UserModel = require("../users");
const { default: transformUser } = require("../../utils/models/transform-user");

describe("MongoDB Methods/Statics", () => {
  test("Transform document", async () => {
    const createdUser = new UserModel(userData);
    await createdUser.validate();
    expect(createdUser).toHaveProperty("_id");
    expect(createdUser).toHaveProperty("__v");
    expect(createdUser).toHaveProperty("password");
    expect(
      createdUser.toObject({ transform: transformUser })
    ).not.toHaveProperty("password");
  });
});
