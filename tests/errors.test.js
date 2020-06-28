const app = require('../src/index');
const request = require('supertest');
const bcrypt = require('bcrypt');
const user = require('../src/models/user');
const sinon = require('sinon');

jest.setTimeout(15000);
describe('App Errors', () => {
  it('reports bcrypt error', async () => {
    sinon.stub(bcrypt, 'compare').throws(new Error('Hash Error'));
    const user = {
      email: 'test@tester3.net',
      name: 'sabicl2',
      password: 'sivscics',
      role: 'user',
      phone_number: '89654893444',
    };

    const userLogin = {
      email: 'test@tester3.net',
      password: 'sivscics',
    };

    let res = await request(app).post('/api/auth/admin/register').send(user);
    console.log(res.text);
    res = await request(app).post('/api/auth/admin/login').send(userLogin);
    console.log(res.text);
    expect(res.statusCode).toEqual(500);
    expect(res.body.description);
    expect(res.body.error);
  });

  it('reports db errors', async () => {
    sinon.stub(user.User, 'findOne').throws('DB Error');
    const userLogin = {
      email: 'test@tester3.net',
      password: 'sivscics',
    };

    let res = await request(app).post('/api/auth/admin/login').send(userLogin);
    console.log(res.text);
    expect(res.statusCode).toEqual(500);
    expect(res.body.description);
    expect(res.body.error);
  });
});
