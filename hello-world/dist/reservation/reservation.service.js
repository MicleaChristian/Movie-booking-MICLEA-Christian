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
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
let ReservationService = class ReservationService {
    reservationRepository;
    MOVIE_DURATION_HOURS = 2;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async create(createReservationDto, user) {
        const { movieId, movieTitle, startTime } = createReservationDto;
        const parsedStartTime = new Date(startTime);
        const endTime = new Date(parsedStartTime);
        endTime.setHours(endTime.getHours() + this.MOVIE_DURATION_HOURS);
        const userReservations = await this.reservationRepository.find({
            where: {
                userId: user.id,
                isCancelled: false,
            },
        });
        for (const reservation of userReservations) {
            const existingStart = new Date(reservation.startTime);
            const existingEnd = new Date(reservation.endTime);
            if ((parsedStartTime >= existingStart && parsedStartTime < existingEnd) ||
                (endTime > existingStart && endTime <= existingEnd) ||
                (parsedStartTime <= existingStart && endTime >= existingEnd)) {
                throw new common_1.BadRequestException(`Time conflict with your reservation for ${reservation.movieTitle}. Please choose a different time.`);
            }
        }
        const newReservation = this.reservationRepository.create({
            userId: user.id,
            movieId,
            movieTitle,
            startTime: parsedStartTime,
            endTime,
        });
        return this.reservationRepository.save(newReservation);
    }
    async findAllByUser(userId) {
        return this.reservationRepository.find({
            where: {
                userId,
                isCancelled: false,
            },
            order: {
                startTime: 'ASC',
            },
        });
    }
    async findOne(id, userId) {
        const reservation = await this.reservationRepository.findOne({
            where: {
                id,
                userId,
            },
        });
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation with ID ${id} not found`);
        }
        return reservation;
    }
    async cancel(id, userId) {
        const reservation = await this.findOne(id, userId);
        if (reservation.isCancelled) {
            throw new common_1.BadRequestException('This reservation is already cancelled');
        }
        if (new Date(reservation.startTime) < new Date()) {
            throw new common_1.BadRequestException('Cannot cancel a reservation that has already started');
        }
        reservation.isCancelled = true;
        return this.reservationRepository.save(reservation);
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservationService);
//# sourceMappingURL=reservation.service.js.map