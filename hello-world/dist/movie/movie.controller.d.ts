import { MovieService } from './movie.service';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    getNowPlaying(): Promise<any>;
    searchMovies(query: string): Promise<any>;
}
