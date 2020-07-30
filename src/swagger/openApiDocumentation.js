const openApiDocumentation = {
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
    {
      url: "https://auth-microapi.herokuapp.com",
      description: "Staging Server",
    },
    {
      url: "https://auth.microapi.dev",
      description: "Staging Server",
    },
  ],
  tags: [
    {
      name: "Authentication",
    },
  ],
  schemes: ["HTTP", "HTTPS"],
  security: {
    bearerAuth: {},
  },
  //input api paths in here
  paths: {
    "/api/user/active": {
      get: {
        tags: ["Active user"],
        description: "Registers admin",
        operationId: "register",
        security: [{ bearerAuth: {} }],
        requestBody: {},
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/register": {
      post: {
        tags: ["Register Admin"],
        description: "Registers admin",
        operationId: "register",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/settings": {
      get: {
        tags: ["Get Admin Settings"],
        description: "Returns the settings of an admin",
        operationId: "settings",
        security: [{ bearerAuth: {} }],
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Update Admin Settings"],
        description: "Updates the settings of an admin",
        operationId: "settings",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSettings",
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/getkey": {
      post: {
        tags: ["Get APIKEY"],
        description: "login user",
        operationId: "getkey",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Login",
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/reset-password": {
      post: {
        tags: ["Admin reset password"],
        description: "Get new password in case of forgotten password",
        operationId: "reset-password",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Forgot",
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/reset-password/{token}": {
      patch: {
        tags: ["Admin chanage password"],
        description: "Get new password in case of forgotten password",
        operationId: "reset-password",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Reset",
              },
            },
          },
          required: true,
        },
        parameters: [
          {
            name: "token",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/register": {
      post: {
        tags: ["Register User"],
        description: "Registers user",
        operationId: "registeruser",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/email-verification/resend": {
      get: {
        tags: ["Email resend verification"],
        description: "email resend varification",
        operationId: "verifyuseremail",
        security: [{ bearerAuth: {} }],
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/enable": {
      get: {
        tags: ["enable 2FA"],
        description: "enable 2FA",
        operationId: "enable2FA",
        security: [{ bearerAuth: {} }],
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/login": {
      post: {
        tags: ["Login User"],
        description: "login user",
        operationId: "loginuser",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Login",
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/verify": {
      get: {
        tags: ["verify OTP"],
        description: "verify OTP",
        operationId: "verifyOTP",
        security: [{ bearerAuth: {} }],
        requestBody: {},
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/password/reset": {
      post: {
        tags: ["forgot-password"],
        description: "Enter your email to reset your password",
        operationId: "forgot-password",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Forgot",
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/password/{token}": {
      patch: {
        tags: ["reset-password"],
        description: "Enter your new password to reset password",
        operationId: "reset-password",
        security: [{ bearerAuth: {} }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Reset",
              },
            },
          },
          required: true,
        },
        parameters: [
          {
            name: "token",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/facebook": {
      get: {
        tags: ["Facebook Auth"],
        description: "Creates or logs in User through Facebook",
        operationId: "FacebookAuth",
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/google": {
      get: {
        tags: ["Google Auth"],
        description: "Creates or logs in User through Google",
        operationId: "googleauth",
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/twitter": {
      get: {
        tags: ["Twitter Auth"],
        description: "Creates or logs in User through Twitter",
        operationId: "twitterauth",
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/github": {
      get: {
        tags: ["Github auth"],
        description: "github auth",
        operationId: "github auth",
        security: [{ bearerAuth: {} }],
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
    "/api/user/logout": {
      get: {
        tags: ["Logout user "],
        description: "logout user",
        operationId: "logoutuser",
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Response",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          username: {
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
          phone_number: {
            type: "string",
            Sdescription: "User phone number",
          },
        },
      },
      Login: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User Email Address",
          },
          password: {
            type: "string",
            description: "User Password",
          },
        },
      },
      UpdateSettings: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User Email Address",
          },
          facebookAuthProvider: {
            type: "object",
            properties: {
              appID: {
                type: "string",
              },
              appSecret: {
                type: "string",
              },
            },
          },
          twitterAuthProvider: {
            type: "object",
            properties: {
              key: {
                type: "string",
              },
              secret: {
                type: "string",
              },
            },
          },
          githubAuthProvider: {
            type: "object",
            properties: {
              clientID: {
                type: "string",
              },
              clientSecret: {
                type: "string",
              },
            },
          },
          googleAuthProvider: {
            type: "object",
            properties: {
              clientID: {
                type: "string",
              },
              clientSecret: {
                type: "string",
              },
            },
          },
        },
      },
      Forgot: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User Email Address",
          },
        },
      },
      Reset: {
        type: "object",
        properties: {
          password: {
            type: "string",
            description: "User Password",
          },
          password_comfirm: {
            type: "string",
            description: "New password",
          },
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
    responses: {
      UnauthorizedError: {
        description: "Access token is missing or invalid",
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
