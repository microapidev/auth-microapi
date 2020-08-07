import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../utils/swaggerSpec";

const docRouter = express.Router();

const swaggerUiOptions = {
  customSiteTitle: "MicroAPI | Authentication API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
};

// use swagger-ui-express for your app documentation endpoint
docRouter.use("/", swaggerUi.serve);
docRouter.get("/", swaggerUi.setup(swaggerSpec, swaggerUiOptions));
docRouter.get("/documentation", swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default docRouter;
