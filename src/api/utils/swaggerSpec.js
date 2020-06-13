const swaggerJSDoc = require("swagger-jsdoc");

// Swagger definition
const swaggerDefinition = {
  info: {
    openapi: "3.0.0", // Version of swagger
    title: "REST API for Authentication", // Title of the documentation
    version: "1.0.0", // Version of the app
    description:
      "This is the REST API Documentation for the Authentication Microservice created by the Fury backend team", // short description of the app
  },
  basePath: "/v1", // the basepath of your endpoint
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["src/api/v1/jsdocs/**/*.yaml"],
};
// initialize swagger-jsdoc
export const swaggerSpec = swaggerJSDoc(options);
