import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesModule } from './movies.module';
import { HttpModule } from '@nestjs/axios';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MoviesModule, HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/movies/now-playing (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/movies/now-playing?page=1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('results');
  });

  it('/movies/search (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/movies/search?query=test&page=1&sort=popularity.desc');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('results');
  });

  it('/movies/:movieId (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/movies/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });
});