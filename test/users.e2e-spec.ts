import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  generatePatchUserData,
  generatePostUserData,
} from './generators/users.generator';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let jwtService: JwtService;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get(JwtService);
    prismaClient = moduleFixture.get(PrismaClient);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const user = await prismaClient.user.findFirst({
      where: {
        roles: {
          some: {
            key: 'superAdmin',
          },
        },
      },
    });

    if (user) {
      const payload = {
        jwt: {
          user: {
            id: user.id,
            email: user.email,
          },
        },
      };
      token = await jwtService.sign(payload);
    }

    await app.init();
  });

  describe('/api/users (POST)', () => {
    const userPostData = generatePostUserData();

    it('Should create user', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', 'bearer ' + token)
        .send(userPostData)
        .expect(201)
        .then((res) => {
          expect(res.body.email).toBe(userPostData.email);
          expect(res.body.firstName).toBe(userPostData.firstName);
          expect(res.body.lastName).toBe(userPostData.lastName);
          return res.body;
        });
    });

    it('Should persist on the database', async () => {
      const user: any = await prismaClient.user.findUnique({
        where: { email: userPostData.email },
      });

      expect(user).toBeDefined();
      expect(userPostData.email).toBe(user.email);
      expect(userPostData.firstName).toBe(user.firstName);
      expect(userPostData.lastName).toBe(user.lastName);
    });

    it('Should fail request due duplicated data', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', 'bearer ' + token)
        .send(userPostData)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Email is already registered',
          error: 'Bad Request',
        });
    });

    it('Should fail request due no body provided', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', 'bearer ' + token)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        });
    });
  });

  describe('/api/users (GET)', () => {
    it('Should retrieve users', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', 'bearer ' + token)
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
        .set('Authorization', 'bearer ' + token)
        .expect(400)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });

    it('Should fail because of wrong size query params', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', 'bearer ' + token)
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
    it('Should retrieve user by id', async () => {
      const users: any = await prismaClient.user.findMany({
        take: 1,
      });

      return request(app.getHttpServer())
        .get(`/api/users/${users[0].id}`)
        .set('Authorization', 'bearer ' + token)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(users[0]);
        });
    });

    it('Should fail because of wrong id', () => {
      return request(app.getHttpServer())
        .get('/api/users/99999999')
        .set('Authorization', 'bearer ' + token)
        .expect(404)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });
  });

  describe('/api/users/:id (PATCH)', () => {
    const userPostData = generatePatchUserData();

    it('Should update previusly created user', async () => {
      const users: any = await prismaClient.user.findMany({
        take: 1,
      });

      return request(app.getHttpServer())
        .patch(`/api/users/${users[0].id}`)
        .set('Authorization', 'bearer ' + token)
        .send(userPostData)
        .expect(200)
        .then((res) => {
          expect(res.body.firstName).toBe(userPostData.firstName);
          expect(res.body.lastName).toBe(userPostData.lastName);
          expect(res.body.techSkills).toBe(userPostData.techSkills);
          expect(res.body.resumeLink).toBe(userPostData.resumeLink);
          expect(res.body.englishLevel).toBe(userPostData.englishLevel);
        });
    });

    it('Should fail because of wrong id', () => {
      return request(app.getHttpServer())
        .patch('/api/users/99999999')
        .set('Authorization', 'bearer ' + token)
        .send(userPostData)
        .expect(404)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });
  });

  describe('/api/users/:id/enabled (PATCH)', () => {
    it('Should update user enabled flag', async () => {
      const users: any = await prismaClient.user.findMany({
        take: 1,
      });

      const res = await request(app.getHttpServer())
        .patch(`/api/users/${users[0].id}/enabled`)
        .send({ enabled: !users[0].enabled })
        .set('Authorization', 'bearer ' + token)
        .expect(200)
        .then((res) => {
          expect(res.body.enabled).toBe(!users[0].enabled);
        });

      const user = await prismaClient.user.findUnique({
        where: { email: users[0].email },
      });

      expect(!users[0].enabled).toBe(user?.enabled);

      return res;
    });

    it('Should fail because of wrong id', () => {
      return request(app.getHttpServer())
        .patch('/api/users/99999999/patch')
        .set('Authorization', 'bearer ' + token)
        .expect(404)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });
  });
});
