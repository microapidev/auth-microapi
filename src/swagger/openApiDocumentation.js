const openApiDocumentation = {
  swagger: '3.0',
  openapi: '3.0.1',
  info: {
    title: 'HNGI Authetication Micro-Service',
    description: 'A Dockerized Microservice for Authentication',
    contact: {
      name: 'HNGI',
    },
  },
  server: [
    {
      url: 'http:localhost:5000',
      description: 'Local Server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
    },
  ],
  security: {
    bearerAuth: {},
  },
  //input api paths in here
  paths: {
    '/api/admin/auth/register': {
      post: {
        tags: ['Register Admin'],
        description: 'Registers admin',
        operationId: 'registeradmin',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                // usename: String,
                // emial: String,
                // password: String
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
        },
      },
    },
    '/api/admin/auth/email/verification': {
      get: {
        tags: ['Email verification'],
        description: 'email varification',
        operationId: 'veryfyuseremail',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                // usename: String,
                // emial: String,
                // password: String
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
        },
      },
    },
    '/api/admin/auth/resend/verification': {
      get: {
        tags: ['Email resend verification'],
        description: 'email resend varification',
        operationId: 'veryfyuseremail',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                // usename: String,
                // emial: String,
                // password: String
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
        },
      },
    },
    '/api/admin/auth/getAPIKEY': {
      post: {
        tags: ['Get APIKEY'],
        description: 'login user',
        operationId: 'loginuser',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {

              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
        },
      },
    },
     '/api/auth/register': {
      post: {
        tags: ['Register User'],
        description: 'Registers user',
        operationId: 'registeruser',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                // usename: String,
                // emial: String,
                // password: String
              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Login User'],
        description: 'login user',
        operationId: 'loginuser',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {

              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/logout': {
      get: {
        tags: ['Logout User'],
        description: 'logout user',
        operationId: 'logoutuser',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {

              },
            },
          },
          required: true,
        },
        parameters: [],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Response',
                },
              },
            },
          },
        },
      },
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'User\'s Name',
          },
          email: {
            type: 'string',
            description: 'User Email Address',
          },
          password: {
            type: 'string',
            description: 'User Password',
          },
          phone_number: {
            type: 'String',
             description: 'User phone number',
          },
          resetPasswordToken: {
            type: 'string',
            description: 'User password reset token',
          },
          resetPasswordExpire: {
            type: 'Date object',
            description: 'User password reset token expiration time',
          },
          createdAt:{
            type: 'Date object',
            description: 'date and time user was created',
          }
        },
      },
      Response: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
          data: {
            type: 'object',
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
};

module.exports = openApiDocumentation;
