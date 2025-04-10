import { Controller, Get, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({ summary: 'Get now playing movies' })
  @ApiResponse({ status: 200, description: 'List of now playing movies' })
  @Get('now-playing')
  async getNowPlaying() {
    return this.movieService.getNowPlaying();
  }

  @ApiOperation({ summary: 'Search for movies' })
  @ApiResponse({ status: 200, description: 'List of movies matching the search query' })
  @Get('search')
  async searchMovies(@Query('query') query: string) {
    return this.movieService.searchMovies(query);
  }
}
