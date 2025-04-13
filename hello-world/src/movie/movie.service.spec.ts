import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('MovieService', () => {
  let service: MovieService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNowPlaying', () => {
    it('should fetch now playing movies from TMDB API', async () => {
      const mockApiKey = 'test-api-key';
      const mockResponse = {
        data: {
          results: [
            { id: 1, title: 'Movie 1' },
            { id: 2, title: 'Movie 2' },
          ],
        },
      };

      mockConfigService.get.mockReturnValue(mockApiKey);
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getNowPlaying();

      expect(result).toEqual(mockResponse.data.results);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${mockApiKey}`,
      );
    });

    it('should return empty array if API call fails', async () => {
      mockConfigService.get.mockReturnValue('test-api-key');
      mockHttpService.get.mockReturnValue(of({ data: { results: [] } }));

      const result = await service.getNowPlaying();
      expect(result).toEqual([]);
    });
  });

  describe('searchMovies', () => {
    it('should search movies from TMDB API', async () => {
      const mockApiKey = 'test-api-key';
      const mockQuery = 'test movie';
      const mockResponse = {
        data: {
          results: [
            { id: 1, title: 'Test Movie 1' },
            { id: 2, title: 'Test Movie 2' },
          ],
        },
      };

      mockConfigService.get.mockReturnValue(mockApiKey);
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.searchMovies(mockQuery);

      expect(result).toEqual(mockResponse.data.results);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/search/movie?api_key=${mockApiKey}&query=${mockQuery}`,
      );
    });

    it('should return empty array if search fails', async () => {
      mockConfigService.get.mockReturnValue('test-api-key');
      mockHttpService.get.mockReturnValue(of({ data: { results: [] } }));

      const result = await service.searchMovies('test');
      expect(result).toEqual([]);
    });
  });
}); 