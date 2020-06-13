import express from "express";
import cors from "cors";
import v1Router from "./v1/routes";
import CustomError from "./utils/customError";
import errorHandler from "./utils/errorhandler";
import { swaggerSpec } from "./utils/swaggerSpec";

const swaggerUi = require("swagger-ui-express");

// create express app
const app = express();

// set up CORS
app.use(cors());

// include middleware to enable json body parsing and nested objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router for api version 1
app.use("/v1", v1Router);

// use swagger-Ui-express for your app documentation endpoint
const swaggerRouter = express.Router();
swaggerRouter.use("/", swaggerUi.serve);
swaggerRouter.get("/", swaggerUi.setup(swaggerSpec));
swaggerRouter.get("/v1", swaggerUi.setup(swaggerSpec));
app.use(["/v1", "/"], swaggerRouter);

// routes not found go here
app.all("*", (req, res, next) => {
  const error = new CustomError(404, "Oops! Resource not found");
  next(error);
});

// default error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

export default app;
