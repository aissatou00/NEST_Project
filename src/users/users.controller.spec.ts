import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './users.module';
import { AuthModule } from '../auth/auth.module';
import { HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user successfully', async () => {
    const registerDto = { username: 'test', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('username', 'test');
    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('should return an error if invalid data is provided during registration', async () => {
    const registerDto = { username: '', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should log in successfully', async () => {
    const loginDto = { username: 'test', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(HttpStatus.OK);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('access_token');
  });

  it('should return an error for invalid credentials during login', async () => {
    const loginDto = { username: 'wrong', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
