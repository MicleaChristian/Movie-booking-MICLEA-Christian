import { Controller, Get, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({ summary: 'Get now playing movies' })
  @ApiResponse({ status: 200, description: 'List of now playing movies' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @Get('now-playing')
  async getNowPlaying(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.movieService.getNowPlaying(page, limit);
  }

  @ApiOperation({ summary: 'Search for movies' })
  @ApiResponse({ status: 200, description: 'List of movies matching the search query' })
  @ApiQuery({ name: 'query', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.movieService.searchMovies(query, page, limit);
  }
}
