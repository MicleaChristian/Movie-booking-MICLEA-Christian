"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
let MovieService = class MovieService {
    httpService;
    configService;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async getNowPlaying(page = 1, limit = 10) {
        const apiKey = this.configService.get('TMDB_API_KEY');
        const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;
        const response = await this.httpService.get(url).toPromise();
        const results = response?.data?.results || [];
        const totalResults = response?.data?.total_results || 0;
        const paginatedResults = results.slice(0, limit);
        return {
            results: paginatedResults,
            total: totalResults,
            page,
            limit,
            totalPages: Math.ceil(totalResults / limit)
        };
    }
    async searchMovies(query, page = 1, limit = 10) {
        const apiKey = this.configService.get('TMDB_API_KEY');
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
        const response = await this.httpService.get(url).toPromise();
        const results = response?.data?.results || [];
        const totalResults = response?.data?.total_results || 0;
        const paginatedResults = results.slice(0, limit);
        return {
            results: paginatedResults,
            total: totalResults,
            page,
            limit,
            totalPages: Math.ceil(totalResults / limit)
        };
    }
};
exports.MovieService = MovieService;
exports.MovieService = MovieService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MovieService);
//# sourceMappingURL=movie.service.js.map