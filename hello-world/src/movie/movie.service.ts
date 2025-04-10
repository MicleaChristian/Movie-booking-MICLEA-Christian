import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MovieService {
  constructor(private readonly httpService: HttpService) {}

  async getNowPlaying(): Promise<any> {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}`;
    const response = await this.httpService.get(url).toPromise();
    return response?.data?.results || [];
  }

  async searchMovies(query: string): Promise<any> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}`;
    const response = await this.httpService.get(url).toPromise();
    return response?.data?.results || [];
  }
}
