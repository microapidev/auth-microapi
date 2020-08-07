import express from "express";
import request from "supertest";
import errorHandler from "../../utils/errorhandler";
import jwt from "jsonwebtoken";
import * as mocks from "../../utils/mocks/settings";
import settingsMiddleware from "../settings";

describe("Settings middleware", () => {
  let app;
  beforeAll(() => {
    process.env.API_SECRET = "secret";
    app = express();
    app.use(settingsMiddleware);
    app.get("/", (req, res) => {
      res.json({ projectId: req.projectId });
    });
    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });
  });

  it("should throw an error if no API key is present", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(401);
  });
  it("should throw an error if invalid API key is present", async () => {
    const res = await request(app)
      .get("/")
      .set("X-MicroAPI-ProjectKey", "crapKey");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid API key found");
  });

  it("should throw invalid settings error", async () => {
    const mockSettings = jest
      .spyOn(mocks, "mockSettings")
      .mockImplementation(() => {
        return mocks.errorMockSettings;
      });

    const apiKey = jwt.sign(
      { projectId: 123 },
      Buffer.from(process.env.API_SECRET, "base64")
    );
    const res = await request(app)
      .get("/")
      .set("X-MicroAPI-ProjectKey", apiKey);
    expect(mockSettings).toHaveBeenCalled();
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid settings found");

    mockSettings.mockRestore();
  });

  it("should return status code 200 and decoded projectId", async () => {
    const apiKey = jwt.sign(
      { projectId: 123 },
      Buffer.from(process.env.API_SECRET, "base64")
    );
    const res = await request(app)
      .get("/")
      .set("X-MicroAPI-ProjectKey", apiKey);
    expect(res.status).toBe(200);
    expect(res.body.projectId).toBe(123);
  });
});
