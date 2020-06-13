// import { expect } from 'chai';
import app from "../../src/api";

const request = require("supertest");

describe("The express server", () => {
  describe("when request is made to /v1", () => {
    it("should respond with status code 301", async () => {
      const res = await request(app).get("/v1");
      expect(res.status).toBe(301);
    });
  });
  describe("when request is made to /", () => {
    it("should respond with status code 301", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });
  });
  describe("when request is made to an invalid route", () => {
    it('should respond with status code 404 and "Oops! Resource not found"', async () => {
      const res = await request(app).get("/cantseeme");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Oops! Resource not found");
    });
  });
});
