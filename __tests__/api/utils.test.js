import express from 'express';
import CustomError from '../../src/api/utils/customError';
import errorHandler from '../../src/api/utils/errorhandler';

const request = require('supertest');

describe('CustomError class', () => {
  it('should be an instance of error', () => {
    expect(new CustomError()).toBeInstanceOf(Error);
  });
});

describe('ErrorHandler Middleware', () => {
  it('when error has statusCode', async () => {
    const testApp = express();

    const err = {
      statusCode: 400,
      message: 'error message'
    };

    testApp.all('*', (req, res, next) => {
      next(err);
    });

    testApp.use((error, req, res, next) => {
      errorHandler(error, req, res, next);
    });

    const res = await request(testApp).get('/');
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toBe('error message');
  });

  it('when error has status', async () => {
    const err = {
      status: 400,
      message: 'error message'
    };
    const testApp = express();

    testApp.all('*', (req, res, next) => {
      next(err);
    });

    testApp.use((error, req, res, next) => {
      errorHandler(error, req, res, next);
    });

    const res = await request(testApp).get('/');
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toBe('error message');
  });

  it('when error has no status', async () => {
    const err = {};

    const testApp = express();

    testApp.all('*', (req, res, next) => {
      next(err);
    });

    testApp.use((error, req, res, next) => {
      errorHandler(error, req, res, next);
    });

    const res = await request(testApp).get('/');
    expect(res.status).toBe(500);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toBe('Internal server error');
  });
});
