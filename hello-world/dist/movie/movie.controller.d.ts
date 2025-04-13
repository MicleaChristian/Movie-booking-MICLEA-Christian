import { MovieService } from './movie.service';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    getNowPlaying(page?: number, limit?: number): Promise<any>;
    searchMovies(query: string, page?: number, limit?: number): Promise<any>;
}
