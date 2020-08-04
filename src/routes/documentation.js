const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("../swagger/openApiDocumentation");

const swaggerUiOptions = {
  customSiteTitle: "MicroAPI | Authentication API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
};

const jsonMiddleware = (req, res, next) => {
  const { format } = req.query;

  if (format && format.toString() === "json") {
    res.send(JSON.stringify(openApiDocumentation));
  } else {
    next();
  }
};

router.get("/info", (req, res) => {
  const iconLink = `${process.env.HOST}/icon.svg`;
  const { title, description } = openApiDocumentation.info;

  res.send(JSON.stringify({ title, description, icon: iconLink }));
});

// use swagger-ui-express for your app documentation endpoint
router.use("/", swaggerUi.serve);
router.get(
  "/",
  jsonMiddleware,
  swaggerUi.setup(openApiDocumentation, swaggerUiOptions)
);
router.get(
  "/docs",
  jsonMiddleware,
  swaggerUi.setup(openApiDocumentation, swaggerUiOptions)
);

module.exports = router;
