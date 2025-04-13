import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

describe('MovieController', () => {
  let controller: MovieController;
  let movieService: MovieService;

  const mockMovieService = {
    getNowPlaying: jest.fn(),
    searchMovies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNowPlaying', () => {
    it('should return now playing movies', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
      ];

      mockMovieService.getNowPlaying.mockResolvedValue(mockMovies);

      const result = await controller.getNowPlaying();

      expect(result).toEqual(mockMovies);
      expect(movieService.getNowPlaying).toHaveBeenCalled();
    });

    it('should handle errors from movie service', async () => {
      mockMovieService.getNowPlaying.mockResolvedValue([]);

      const result = await controller.getNowPlaying();

      expect(result).toEqual([]);
      expect(movieService.getNowPlaying).toHaveBeenCalled();
    });
  });

  describe('searchMovies', () => {
    it('should search movies with given query', async () => {
      const mockQuery = 'test movie';
      const mockMovies = [
        { id: 1, title: 'Test Movie 1' },
        { id: 2, title: 'Test Movie 2' },
      ];

      mockMovieService.searchMovies.mockResolvedValue(mockMovies);

      const result = await controller.searchMovies(mockQuery);

      expect(result).toEqual(mockMovies);
      expect(movieService.searchMovies).toHaveBeenCalledWith(mockQuery);
    });

    it('should handle empty search results', async () => {
      const mockQuery = 'nonexistent movie';
      mockMovieService.searchMovies.mockResolvedValue([]);

      const result = await controller.searchMovies(mockQuery);

      expect(result).toEqual([]);
      expect(movieService.searchMovies).toHaveBeenCalledWith(mockQuery);
    });
  });
}); 