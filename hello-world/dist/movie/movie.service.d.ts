import { HttpService } from '@nestjs/axios';
export declare class MovieService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getNowPlaying(): Promise<any>;
    searchMovies(query: string): Promise<any>;
}
