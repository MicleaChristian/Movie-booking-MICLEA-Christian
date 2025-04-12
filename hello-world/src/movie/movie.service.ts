import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getNowPlaying(): Promise<any> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
    const response = await this.httpService.get(url).toPromise();
    return response?.data?.results || [];
  }

  async searchMovies(query: string): Promise<any> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    const response = await this.httpService.get(url).toPromise();
    return response?.data?.results || [];
  }
}
