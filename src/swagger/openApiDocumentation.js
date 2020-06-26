const openApiDocumentation = {
  swagger: "3.0",
  openapi: "3.0.1",
  info: {
    title: "HNGI Authetication Micro-Service",
    description: "A Dockerized Microservice for Authentication",
    contact: {
      name: "HNGI",
    },
  },
  server: [
    {
      url: "http:localhost:5000",
      description: "Local Server",
    },
  ],
  tags: [
    {
      name: "API Authentication",
    },
    {
      name: "Auth Operations",
    }
  ],
  security: {
    bearerAuth: {},
  },
  //input api paths in here
  paths: {

  },

  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "User's Name",
          },
          email: {
            type: "string",
            description: "User Email Address",
          },
          password: {
            type: "string",
            description: "User Password",
          },
          role: {
            type: "String",
            enum: ["User"],
          },
          resetPasswordToken: {
            type: "string",
            description: "User password reset token",
          },
          resetPasswordExpire: {
            type: "Date object",
            description: "User password reset token expiration time",
          },
          createdAt:{
            type: "Date object",
            description: "date and time user was created",
          }
        },
      },
      Response: {
        type: "object",
        properties: {
          status: {
            type: "string",
          },
          message: {
            type: "string",
          },
          data: {
            type: "object",
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
    },
  },
};

module.exports = openApiDocumentation;
