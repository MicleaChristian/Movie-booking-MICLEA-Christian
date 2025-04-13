import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getNowPlaying(page: number = 1, limit: number = 10): Promise<any> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;
    const response = await this.httpService.get(url).toPromise();
    const results = response?.data?.results || [];
    const totalResults = response?.data?.total_results || 0;
    
    // Apply limit on the backend side
    const paginatedResults = results.slice(0, limit);
    
    return {
      results: paginatedResults,
      total: totalResults,
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit)
    };
  }

  async searchMovies(query: string, page: number = 1, limit: number = 10): Promise<any> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
    const response = await this.httpService.get(url).toPromise();
    const results = response?.data?.results || [];
    const totalResults = response?.data?.total_results || 0;
    
    // Apply limit on the backend side
    const paginatedResults = results.slice(0, limit);
    
    return {
      results: paginatedResults,
      total: totalResults,
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit)
    };
  }
}
