import swaggerJSDoc from "swagger-jsdoc";

// Swagger definition
const swaggerDefinition = {
  info: {
    openapi: "3.0.21", // Version of swagger
    title: "Authentication MicroAPI", // Title of the documentation
    version: "2.0.0", // Version of the app
    description:
      "Authenticate all your users with local (email and password) and social authentication (Google, Twitter, Facebook, and GitHub). Get started and give your users a smooth authentication flow.", // short description of the app
    termsOfService: "https://microapi.dev/terms_of_service",
    contact: {
      name: "API Support",
      url: "https://microapi.dev/contact_us",
      email: "api@auth.microapi.dev",
    },
    license: {
      name: "MIT",
      url: "https://github.com/microapidev/auth-microapi/blob/v2/LICENSE",
    },
  },
  servers: [
    {
      url: "https://auth.microapi.dev",
      description: "Production server (uses live data)",
    },
    {
      url: "https://authentication-microapi-v2.herokuapp.com",
      description: "Staging server (uses test data)",
    },
    {
      url: "http://localhost:3000",
      description: "Local server (uses test data)",
    },
  ],
  tags: [
    {
      name: "admins",
      description: "Create and manage administrators.",
    },
    {
      name: "users",
      description: "Create and manage users.",
    },
    {
      name: "providers",
      description:
        "Authenticate using one of the supported authentication providers.",
    },
  ],
  components: {
    securitySchemes: {
      AdminToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      UserToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["src/jsdocs/**/*.yaml"],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
