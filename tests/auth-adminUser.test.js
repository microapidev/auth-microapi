import app from "../src/index";
const request = require("supertest");

describe("POST /api/auth/admin/register", () => {
  const user_one = {
    email: "omegalosamul@gmail.com",
    name: "sabicl",
    password: "sivscics",
    role: "user",
    phone_number: "89654893899",
  };

  const user_one_login = {
    email: "omegalosamul@gmail.com",
    password: "sivscics",
  };

  const user_two = {
    email: "omegalosamul@gmail.com",
    name: "sabicl",
    password: "sivscics",
    role: "user",
    phone_number: "896548999",
  };

  it("should register user if phone number is entered", async () => {
    const res = await request(app)
      .post("/api/auth/admin/register")
      .send(user_one);
    expect(res.statusCode).toEqual(200);
  });

  it("should not register user if phone number is not entered or entered incorrectly", async () => {
    const res = await request(app)
      .post("/api/auth/admin/register")
      .send(user_two);
    expect(res.statusCode).toEqual(422);
  });

  it("should login admin User and return APIkey", async () => {
    const res = await request(app)
      .post("/api/auth/admin/login")
      .send(user_one_login);

    expect(res.body.API_KEY);
  });
});
