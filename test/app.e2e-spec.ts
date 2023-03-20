import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { generatePostUserData } from './generators/users.generator';
import { assert } from 'console';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/v0.1/api/users (POST)', () => {
    const userPostData = generatePostUserData();
    console.log('userPostData', userPostData);

    it('Should create user', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send(userPostData)
        .expect(201)
        .then((res) => {
          assert(res.body.email, userPostData.email);
          assert(res.body.firstName, userPostData.firstName);
          assert(res.body.lastName, userPostData.lastName);
        });
    });

    it('Should fail request', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send(userPostData)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Email is already registered',
          error: 'Bad Request',
        });
    });
  });
});
