import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReservationService {
  private readonly MOVIE_DURATION_HOURS = 2; // Each movie lasts 2 hours

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto, user: User): Promise<Reservation> {
    try {
      const { movieId, movieTitle, startTime } = createReservationDto;
      
      if (!movieId || !movieTitle || !startTime) {
        throw new BadRequestException('Missing required fields: movieId, movieTitle, or startTime');
      }

      // Validate movieId is a number
      if (typeof movieId !== 'number') {
        throw new BadRequestException('movieId must be a number');
      }

      // Parse and validate the start time
      let parsedStartTime: Date;
      try {
        parsedStartTime = new Date(startTime);
        if (isNaN(parsedStartTime.getTime())) {
          throw new Error('Invalid date');
        }
      } catch (error) {
        throw new BadRequestException('Invalid startTime format');
      }

      // Check if the start time is in the past
      if (parsedStartTime < new Date()) {
        throw new BadRequestException('Cannot create reservations for past times');
      }
      
      // Calculate end time (startTime + 2 hours)
      const endTime = new Date(parsedStartTime);
      endTime.setHours(endTime.getHours() + this.MOVIE_DURATION_HOURS);

      // Find all non-cancelled reservations for this user
      const userReservations = await this.reservationRepository.find({
        where: {
          userId: user.id,
          isCancelled: false,
        },
      });

      // Check for time conflicts with existing reservations
      for (const reservation of userReservations) {
        // Check if new reservation overlaps with existing one
        const existingStart = new Date(reservation.startTime);
        const existingEnd = new Date(reservation.endTime);

        if (
          (parsedStartTime >= existingStart && parsedStartTime < existingEnd) ||
          (endTime > existingStart && endTime <= existingEnd) ||
          (parsedStartTime <= existingStart && endTime >= existingEnd)
        ) {
          throw new BadRequestException(
            `Time conflict with your reservation for ${reservation.movieTitle}. Please choose a different time.`
          );
        }
      }

      // Create and save the new reservation
      const newReservation = this.reservationRepository.create({
        userId: user.id,
        movieId,
        movieTitle,
        startTime: parsedStartTime,
        endTime,
        isCancelled: false,
      });

      return await this.reservationRepository.save(newReservation);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating reservation:', error);
      throw new InternalServerErrorException('Failed to create reservation. Please try again later.');
    }
  }

  async findAllByUser(userId: number): Promise<Reservation[]> {
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

  async findOne(id: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async cancel(id: number, userId: number): Promise<Reservation> {
    const reservation = await this.findOne(id, userId);

    // Check if reservation is already cancelled
    if (reservation.isCancelled) {
      throw new BadRequestException('This reservation is already cancelled');
    }

    // Check if the reservation start time has already passed
    if (new Date(reservation.startTime) < new Date()) {
      throw new BadRequestException('Cannot cancel a reservation that has already started');
    }

    // Mark as cancelled and save
    reservation.isCancelled = true;
    return this.reservationRepository.save(reservation);
  }
} 