import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('FAKE_API_KEY') },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should fetch now playing movies', async () => {
    const mockResponse: AxiosResponse = {
      data: { results: [{ id: 1, title: 'Test Movie' }] },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(), 
      config: { headers: new AxiosHeaders() }, 
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.getNowPlayingMovies(1).toPromise();
    expect(result).toEqual({ results: [{ id: 1, title: 'Test Movie' }] });
  });

  it('should fetch movie details', async () => {
    const mockResponse: AxiosResponse = {
      data: { id: 1, title: 'Test Movie' },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(), 
      config: { headers: new AxiosHeaders() }, 
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.getMovieDetails(1).toPromise();
    expect(result).toEqual({ id: 1, title: 'Test Movie' });
  });
});
