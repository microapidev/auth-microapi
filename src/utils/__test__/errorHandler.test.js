import errorHandler from "../errorhandler";
import CustomError from "../customError";
import express from "express";
import request from "supertest";

const app = express();
app.get("/statusCodeError", (req, res, next) => {
  const error = new CustomError(400, "Error");
  return next(error);
});

app.get("/statusError", (req, res, next) => {
  const error = new Error("Error");
  error.status = 404;
  return next(error);
});

app.get("/unknownError", (req, res, next) => {
  try {
    throw new Error("Unknown Error");
  } catch (error) {
    next(error);
  }
});

// default error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

describe("Unit test errorHandler", () => {
  it("should return formatted response when statusCode is passed", async () => {
    const response = await request(app).get("/statusCodeError");
    expect(response.status).toBe(400);
  });
  it("should return formatted response when status is passed", async () => {
    const response = await request(app).get("/statusError");
    expect(response.status).toBe(404);
  });
  it("should return formatted response unknown error occurs", async () => {
    const response = await request(app).get("/unknownError");
    expect(response.status).toBe(500);
  });
});
