import app from "../";
import request from "supertest";

describe("Server runs", () => {
  test("Should return status 200 and render Swagger docs", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toMatchSnapshot();
  });
  it("should return a status of 404", async () => {
    const response = await request(app).get("/garbledygook");
    expect(response.status).toBe(404);
  });
});
