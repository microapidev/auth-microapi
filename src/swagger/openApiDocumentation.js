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
    {
      url: 'https://auth-microapi.herokuapp.com',
      description: 'Production Server',
    }
  ],
  tags: [
    {
      name: 'Authentication',
    },
  ],
  schemes: [
    'HTTP',
    'HTTPS'
  ],
  security: {
    bearerAuth: {},
  },
  //input api paths in here
  paths: {
    '/api/auth/admin/register': {
      post: {
        tags: ['Register Admin'],
        description: 'Registers admin',
        operationId: 'register',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
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
    '/api/auth/admin/getkey': {
      post: {
        tags: ['Get APIKEY'],
        description: 'login user',
        operationId: 'getkey',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Login',
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
    '/api/auth/admin/reset-password': {
      post: {
        tags: ['Admin reset-password'],
        description: 'Get new password in case of forgotten password',
        operationId: 'reset-password',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Forgot',
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
    '/api/auth/admin/reset-password/{token}': {
      patch: {
        tags: ['Admin reset-password'],
        description: 'Get new password in case of forgotten password',
        operationId: 'reset-password',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Reset',
              },
            },
          },
          required: true,
        },
        parameters: [
          {
            name: 'token',
            in: 'query',
            schema: {
              type: 'string',
            },
            required: true,
          },
        ],
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
    '/api/auth/user/register': {
      post: {
        tags: ['Register User'],
        description: 'Registers user',
        operationId: 'registeruser',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
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
    '/api/auth/user/email-verification/resend': {
      get: {
        tags: ['Email resend verification'],
        description: 'email resend varification',
        operationId: 'verifyuseremail',
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
    '/api/auth/user/login': {
      post: {
        tags: ['Login User'],
        description: 'login user',
        operationId: 'loginuser',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Login',
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
    '/api/auth/user/password/reset': {
      post: {
        tags: ['forgot-password'],
        description: 'Enter your email to reset your password',
        operationId: 'forgot-password',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Forgot',
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
    '/api/auth/user/password/{token}': {
      patch: {
        tags: ['reset-password'],
        description: 'Enter your new password to reset password',
        operationId: 'reset-password',
        security: [ {bearerAuth: {}}],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Reset',
              },
            },
          },
          required: true,
        },
        parameters: [
          {
            name: 'token',
            in: 'query',
            schema: {
              type: 'string',
            },
            required: true,
          },
        ],
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
    '/api/auth/facebook': {
      get: {
        tags: ['Facebook Auth'],
        description: 'Creates or logs in User through Facebook',
        operationId: 'FacebookAuth',
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
    '/api/auth/google': {
      get: {
        tags: ['Google Auth'],
        description: 'Creates or logs in User through Google',
        operationId: 'googleauth',
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
    '/api/auth/twitter': {
      get: {
        tags: ['Twitter Auth'],
        description: 'Creates or logs in User through Twitter',
        operationId: 'twitterauth',
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
    '/api/auth/github': {
      get: {
        tags: ['Github auth'],
        description: 'github auth',
        operationId: 'github auth',
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
    '/api/auth/user/logout': {
      get: {
        tags: ['Logout user '],
        description: 'logout user',
        operationId: 'logoutuser',
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
            type: 'string',
            Sdescription: 'User phone number',
          },
        },
      },
      Login: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User Email Address',
          },
          password: {
            type: 'string',
            description: 'User Password',
          },
        },
      },
      Forgot: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User Email Address',
          },
        },
      },
      Reset: {
        type: 'object',
        properties: {
          password: {
            type: 'string',
            description: 'User Password',
          },
          password_comfirm: {
            type: 'string',
            description: 'New password',
          },
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
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid'
      }
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