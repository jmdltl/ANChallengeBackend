import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { generatePostClientData } from './generators/clients.generator';
import { generatePatchClientData } from './generators/clients.generator';
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

  describe('/api/clients (POST)', () => {
    const postData = generatePostClientData();

    it('Should create client', () => {
      return request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', 'bearer ' + token)
        .send(postData)
        .expect(201)
        .then((res) => {
          expect(res.body.name).toBe(postData.name);
          expect(res.body.key).toBeDefined();
          return res.body;
        });
    });

    it('Should persist on the database', async () => {
      const client: any = await prismaClient.client.findFirst({
        where: { name: postData.name },
      });

      expect(client).toBeDefined();
      expect(postData.name).toBe(client.name);
      expect(client.key).toBeDefined();
    });

    it('Should fail request due duplicated data', () => {
      return request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', 'bearer ' + token)
        .send(postData)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Client already exists',
          error: 'Bad Request',
        });
    });

    it('Should fail request due no body provided', () => {
      return request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', 'bearer ' + token)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['name must be a string'],
          error: 'Bad Request',
        });
    });
  });

  describe('/api/clients (GET)', () => {
    it('Should retrieve clients ', () => {
      return request(app.getHttpServer())
        .get('/api/clients')
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
        .get('/api/clients')
        .set('Authorization', 'bearer ' + token)
        .expect(400)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });

    it('Should fail because of wrong size query params', () => {
      return request(app.getHttpServer())
        .get('/api/clients')
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

  describe('/api/clients/:id (GET)', () => {
    it('Should retrieve client by id', async () => {
      const clients: any = await prismaClient.client.findMany({
        take: 1,
      });

      return request(app.getHttpServer())
        .get(`/api/clients/${clients[0].id}`)
        .set('Authorization', 'bearer ' + token)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(clients[0]);
        });
    });

    it('Should fail because of wrong id', () => {
      return request(app.getHttpServer())
        .get('/api/clients/99999999')
        .set('Authorization', 'bearer ' + token)
        .expect(404)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });
  });

  describe('/api/clients/:id (PATCH)', () => {
    const postData = generatePatchClientData();

    it('Should update previusly created client', async () => {
      const clients: any = await prismaClient.client.findMany({
        take: 1,
      });

      return request(app.getHttpServer())
        .patch(`/api/clients/${clients[0].id}`)
        .set('Authorization', 'bearer ' + token)
        .send(postData)
        .expect(200)
        .then((res) => {
          expect(res.body.name).not.toEqual(clients[0].name);
          expect(res.body.key).not.toEqual(clients[0].key);
        });
    });

    it('Should fail because of wrong id', () => {
      return request(app.getHttpServer())
        .patch('/api/clients/99999999')
        .set('Authorization', 'bearer ' + token)
        .send(postData)
        .expect(404)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });
  });

  describe('/api/clients/:id/archived (PATCH)', () => {
    it('Should update client archived flag', async () => {
      const clients: any = await prismaClient.client.findMany({
        take: 1,
      });

      const res = await request(app.getHttpServer())
        .patch(`/api/clients/${clients[0].id}/archived`)
        .set('Authorization', 'bearer ' + token)
        .send({ archived: !clients[0].archived })
        .expect(200)
        .then((res) => {
          expect(res.body.archived).toBe(!clients[0].archived);
        });

      const client = await prismaClient.client.findUnique({
        where: { id: clients[0].id },
      });

      expect(!clients[0].archived).toBe(client?.archived);

      return res;
    });

    it('Should fail because of wrong id', () => {
      return request(app.getHttpServer())
        .patch('/api/clients/99999999/patch')
        .set('Authorization', 'bearer ' + token)
        .expect(404)
        .then((res) => {
          expect.arrayContaining(res.body.message);
        });
    });
  });
});
