import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class MovieService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    getNowPlaying(): Promise<any>;
    searchMovies(query: string): Promise<any>;
}
