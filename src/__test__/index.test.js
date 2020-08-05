import app from "../";
import request from "supertest";

describe("Server runs", () => {
  it("should return a status of 200", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
  it("should return a status of 404", async () => {
    const response = await request(app).get("/garbledygook");
    expect(response.status).toBe(404);
  });
});
