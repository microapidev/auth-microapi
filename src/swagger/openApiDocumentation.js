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
    {
      name: 'CRUD Operations ',
    }
  ],
  security: {
    bearerAuth: {},
  },
  //input api paths in here
  paths: {
    '/api/auth/active': {
      get: {
        tags: ['Active User'],
        description: 'gets active user',
        operationId: 'getactiveuser',
        security: [ {bearerAuth: {}}],
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
        tags: ['Register User','User Authentication','CRUD Operations'],
        description: 'Registers user',
        operationId: 'registeruser',
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
    '/api/auth/login': {
      post: {
        tags: ['Login User','User Authentication','CRUD Operations'],
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
      post: {
        tags: ['Logout User','User Authentication','CRUD Operations'],
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
          name: {
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
          role: {
            type: 'String',
            enum: ['User'],
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
