import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
    
    if (!this.apiKey) {
      throw new Error('TMDB_API_KEY est manquant ou invalide dans le fichier .env');
    }
    this.apiUrl = 'https://api.themoviedb.org/3';
  }

  getNowPlayingMovies(page: number = 1) {
    const url = `${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&language=fr-FR&page=${page}`;
    return this.fetchData(url);
  }

  searchMovies(query: string, page: number = 1, sort: string = 'popularity.desc') {
    if (!query) {
      throw new HttpException('Le paramètre "query" est requis.', HttpStatus.BAD_REQUEST);
    }

    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&language=fr-FR&page=${page}&sort_by=${sort}`;
    return this.fetchData(url);
  }

  getMovieDetails(movieId: number) {
    const url = `${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}&language=fr-FR`;
    return this.fetchData(url);
  }

  private fetchData(url: string) {
    return this.httpService.get<AxiosResponse<any>>(url).pipe(
      map((response) => response.data), 
      catchError((error) => {
        this.logger.error(`Erreur API TMDb: ${error.message}`);
        throw new HttpException('Impossible de récupérer les données.', HttpStatus.BAD_GATEWAY);
      })
    );
  }
}
