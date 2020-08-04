// List of tags used by documentation.
const GENERAL_TAG = "General";
const ADMINISTRATOR_TAG = "Administrators";
const USER_TAG = "Users";
const AUTH_PROVIDER_TAG = "Authentication Providers";

// Security schema.
const apiKeySecurity = [{ Bearer: {} }];

const openApiDocumentation = {
  openapi: "3.0.21",
  info: {
    version: "1.0.0",
    title: "HNGI Authetication Micro-Service",
    description: "A Dockerized Microservice for Authentication",
    contact: {
      name: "HNGI",
    },
  },
  servers: [
    {
      url: "https://authentication-microapi.herokuapp.com/api",
      description: "Staging Server (uses test data)",
    },
    {
      url: "https://auth.microapi.dev/api",
      description: "Production Server (uses live data)",
    },
    {
      url: "/api",
      description: "Local Server (uses your data)",
    },
  ],
  tags: [
    {
      name: GENERAL_TAG,
      description: "General information and data.",
    },
    {
      name: ADMINISTRATOR_TAG,
      description: "Create and modify administrators.",
    },
    {
      name: USER_TAG,
      description: "Create and modify users.",
    },
    {
      name: AUTH_PROVIDER_TAG,
      description: "Create and modify users via the authentication providers.",
    },
  ],
  schemes: ["HTTP", "HTTPS"],
  //input api paths in here
  paths: {
    "/info": {
      get: {
        tags: [GENERAL_TAG],
        description: "Returns the basic information of the API.",
        operationId: "info",
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
    "/admin/register": {
      post: {
        tags: [ADMINISTRATOR_TAG],
        description: "Registers admin",
        operationId: "register",
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
    "/admin/getkey": {
      post: {
        tags: [ADMINISTRATOR_TAG],
        description: "login user",
        operationId: "getkey",
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
    "/admin/settings-schema": {
      get: {
        tags: [ADMINISTRATOR_TAG],
        description: "Returns the settings schema of the API",
        operationId: "settings",
        security: apiKeySecurity,
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
    "/admin/settings": {
      get: {
        tags: [ADMINISTRATOR_TAG],
        description: "Returns the settings of an admin",
        operationId: "settings",
        security: apiKeySecurity,
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
        tags: [ADMINISTRATOR_TAG],
        description: "Updates the settings of an admin",
        operationId: "settings",
        security: apiKeySecurity,
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
    "/admin/reset-password": {
      post: {
        tags: [ADMINISTRATOR_TAG],
        description: "Get new password in case of forgotten password",
        operationId: "reset-password",
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
    "/admin/reset-password/{token}": {
      patch: {
        tags: [ADMINISTRATOR_TAG],
        description: "Get new password in case of forgotten password",
        operationId: "reset-password",
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
    "/user/register": {
      post: {
        tags: [USER_TAG],
        description: "Registers user",
        operationId: "registeruser",
        security: apiKeySecurity,
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
    "/user/active": {
      get: {
        tags: [USER_TAG],
        description: "Registers admin",
        operationId: "register",
        security: apiKeySecurity,
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
    "/user/email-verification/resend": {
      get: {
        tags: [USER_TAG],
        description: "email resend varification",
        operationId: "verifyuseremail",
        security: apiKeySecurity,
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
    "/user/enable2fa": {
      get: {
        tags: [USER_TAG],
        description: "enable 2FA",
        operationId: "enable2FA",
        security: apiKeySecurity,
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
    "/user/login": {
      post: {
        tags: [USER_TAG],
        description: "login user",
        operationId: "loginuser",
        security: apiKeySecurity,
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
    "/user/verify": {
      get: {
        tags: [USER_TAG],
        description: "verify OTP",
        operationId: "verifyOTP",
        security: apiKeySecurity,
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
    "/user/password/reset": {
      post: {
        tags: [USER_TAG],
        description: "Enter your email to reset your password",
        operationId: "forgot-password",
        security: apiKeySecurity,
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
    "/user/password/{token}": {
      patch: {
        tags: [USER_TAG],
        description: "Enter your new password to reset password",
        operationId: "reset-password",
        security: apiKeySecurity,
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
    "/user/logout": {
      get: {
        tags: [USER_TAG],
        description: "logout user",
        operationId: "logoutuser",
        security: apiKeySecurity,
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
    "/facebook": {
      get: {
        tags: [AUTH_PROVIDER_TAG],
        description: "Creates or logs in User through Facebook",
        operationId: "FacebookAuth",
        security: apiKeySecurity,
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
    "/google": {
      get: {
        tags: [AUTH_PROVIDER_TAG],
        description: "Creates or logs in User through Google",
        operationId: "googleauth",
        security: apiKeySecurity,
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
    "/twitter": {
      get: {
        tags: [AUTH_PROVIDER_TAG],
        description: "Creates or logs in User through Twitter",
        operationId: "twitterauth",
        security: apiKeySecurity,
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
    "/github": {
      get: {
        tags: [AUTH_PROVIDER_TAG],
        description: "github auth",
        operationId: "github auth",
        security: apiKeySecurity,
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
          emailVerifyCallbackUrl: {
            type: "string",
            description: "Callback url for redirect on email verification",
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
          },
          successCallbackUrl: {
            type: "string",
          },
          failureCallbackUrl: {
            type: "string",
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
          emailVerifyCallbackUrl: {
            type: "string",
            description: "Callback url for redirect on email verification",
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
      Bearer: {
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
