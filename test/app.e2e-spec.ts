import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { generatePostUserData } from './generators/users.generator';
import { assert } from 'console';
import { User } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let insertedUser: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe('/api/users (POST)', () => {
    const userPostData = generatePostUserData();

    it('Should create user', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send(userPostData)
        .expect(201)
        .then((res) => {
          assert(res.body.email, userPostData.email);
          assert(res.body.firstName, userPostData.firstName);
          assert(res.body.lastName, userPostData.lastName);
          insertedUser = res.body;
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

  describe('/api/users (GET)', () => {
    it('Should retrieve users', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .query({
          skip: 0,
          take: 20,
        })
        .expect(200)
        .then((res) => {
          expect.arrayContaining(res.body);
        });
    });

    it('Should fail because of missing query params', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(400)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });

    it('Should fail because of wrong size query params', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .query({
          take: 150,
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Max numbers of records per query are 100.'],
          error: 'Bad Request',
        })
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });
  });

  describe('/api/users/:id (GET)', () => {
    it('Should retrieve user by id', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${insertedUser.id}`)
        .expect(200)
        .then((res) => {
          assert(res.body, insertedUser);
        });
    });

    it('Should fail because of wrong id', () => {
      return request(app.getHttpServer())
        .get('/api/users/99999999')
        .expect(404)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });
  });
});
