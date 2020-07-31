const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("../swagger/openApiDocumentation");

const swaggerUiOptions = {
  customSiteTitle: "MicroAPI | Authentication API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
};

// use swagger-ui-express for your app documentation endpoint
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(openApiDocumentation, swaggerUiOptions));
router.get("/docs", swaggerUi.setup(openApiDocumentation, swaggerUiOptions));

module.exports = router;
