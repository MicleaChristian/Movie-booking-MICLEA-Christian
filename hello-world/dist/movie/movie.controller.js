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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieController = void 0;
const common_1 = require("@nestjs/common");
const movie_service_1 = require("./movie.service");
const swagger_1 = require("@nestjs/swagger");
let MovieController = class MovieController {
    movieService;
    constructor(movieService) {
        this.movieService = movieService;
    }
    async getNowPlaying(page, limit) {
        return this.movieService.getNowPlaying(page, limit);
    }
    async searchMovies(query, page, limit) {
        return this.movieService.searchMovies(query, page, limit);
    }
};
exports.MovieController = MovieController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get now playing movies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of now playing movies' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of items per page' }),
    (0, common_1.Get)('now-playing'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "getNowPlaying", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Search for movies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of movies matching the search query' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: true, type: String, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of items per page' }),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], MovieController.prototype, "searchMovies", null);
exports.MovieController = MovieController = __decorate([
    (0, swagger_1.ApiTags)('Movies'),
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movie_service_1.MovieService])
], MovieController);
//# sourceMappingURL=movie.controller.js.map