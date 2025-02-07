import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Vous pouvez créer un utilisateur et obtenir un token d'accès pour tester l'authentification
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'testuser',
      password: 'testpass',
    });

    accessToken = loginResponse.body.accessToken;
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'newuser', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('username', 'newuser');
  });

  it('should login the user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'newuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  afterAll(async () => {
    await app.close();
  });
});
