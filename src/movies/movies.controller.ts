import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('movies') 
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('now-playing')
  @ApiOperation({ summary: 'Récupérer les films en cours de diffusion' })
  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Numéro de page pour la pagination' })
  async getNowPlaying(@Query('page') page?: number) {
    return this.moviesService.getNowPlayingMovies(page);
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher un film' })
  @ApiQuery({ name: 'query', required: true, type: String, description: 'Terme de recherche pour le film' })
  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Numéro de page pour la pagination' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Critère de tri des films', enum: ['popularity.desc', 'popularity.asc', 'release_date.desc', 'release_date.asc', 'vote_average.desc', 'vote_average.asc'] })
  async searchMovies(@Query('query') query: string, @Query('page') page?: number, @Query('sort') sort?: string) {
    if (!query) {
      throw new Error('Le paramètre "query" est requis pour rechercher un film.');
    }
    return this.moviesService.searchMovies(query, page, sort);
  }
  

  @Get(':movieId')
  @ApiOperation({ summary: 'Obtenir les détails d’un film' })
  @ApiParam({ name: 'movieId', required: true, type: Number, description: 'ID du film à récupérer' })
  async getMovieDetails(@Param('movieId') movieId: number) {
    return this.moviesService.getMovieDetails(movieId);
  }
  
}
