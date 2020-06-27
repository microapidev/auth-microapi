import app, { post } from "../src/index";
import { string } from "@hapi/joi";
const request = require('supertest');
const cookieParser = require('cookie-parser');

describe('POST/api/login',() =>  {
    const user ={
        email: string,
        password: string,
    };
    it('should login',() => {
        const req = request(app)
           .post('/login')
           .send(user)
           //.set('Cookie', cookie)
           .then(res => {
            const cookie = res
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            agent.jar.setCookies(cookie);
            expect(res.status).toEqual(200)
          });
    });
});