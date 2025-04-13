import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class MovieService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    getNowPlaying(page?: number, limit?: number): Promise<any>;
    searchMovies(query: string, page?: number, limit?: number): Promise<any>;
}
