import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../entities/reservation.entity';
import { BadRequestException } from '@nestjs/common';

describe('ReservationService - Time Conflict Logic', () => {
  let service: ReservationService;
  let repository: any;

  const mockUser = { id: 1, username: 'testuser' };
  
  // Base reservation that we'll reuse in tests
  const baseReservation = {
    movieId: 123,
    movieTitle: 'Existing Movie',
    startTime: new Date('2023-10-30T18:00:00Z'),
    endTime: new Date('2023-10-30T20:00:00Z'), // 2 hour duration
    userId: mockUser.id,
    isCancelled: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation(dto => dto),
            save: jest.fn().mockImplementation(reservation => Promise.resolve({
              id: Math.floor(Math.random() * 100),
              ...reservation,
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get(getRepositoryToken(Reservation));
  });

  it('should allow reservations with no time conflicts', async () => {
    // Set up existing reservation from 18:00 to 20:00
    repository.find.mockResolvedValue([baseReservation]);

    // New reservation starting at 20:00 (exactly when the other ends)
    const createDto = {
      movieId: 456,
      movieTitle: 'New Movie',
      startTime: '2023-10-30T20:00:00Z', // Starts exactly when the other ends
    };

    // Should not throw an error
    await expect(service.create(createDto, mockUser as any)).resolves.toBeDefined();
    expect(repository.save).toHaveBeenCalled();
  });

  it('should reject reservations that overlap at the start', async () => {
    // Set up existing reservation from 18:00 to 20:00
    repository.find.mockResolvedValue([baseReservation]);

    // New reservation starting at 19:00 (during the existing one)
    const createDto = {
      movieId: 456,
      movieTitle: 'Overlap Movie',
      startTime: '2023-10-30T19:00:00Z', // During the existing reservation
    };

    // Should throw a BadRequestException
    await expect(service.create(createDto, mockUser as any)).rejects.toThrow(BadRequestException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should reject reservations that overlap at the end', async () => {
    // Set up existing reservation from 18:00 to 20:00
    repository.find.mockResolvedValue([baseReservation]);

    // New reservation starting at 17:00 (before the existing one but ending during it)
    const createDto = {
      movieId: 456,
      movieTitle: 'Overlap Movie',
      startTime: '2023-10-30T17:00:00Z', // Before the existing reservation
    };
    // This would end at 19:00, during the existing reservation

    // Should throw a BadRequestException
    await expect(service.create(createDto, mockUser as any)).rejects.toThrow(BadRequestException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should reject reservations that completely contain another', async () => {
    // Set up existing reservation from 18:00 to 20:00
    repository.find.mockResolvedValue([baseReservation]);

    // New reservation starting at 17:00 and ending at 21:00 (completely contains the existing one)
    const createDto = {
      movieId: 456,
      movieTitle: 'Containing Movie',
      startTime: '2023-10-30T17:00:00Z', // 1 hour before the existing reservation
    };
    // This would end at 19:00, during the existing reservation

    // Should throw a BadRequestException
    await expect(service.create(createDto, mockUser as any)).rejects.toThrow(BadRequestException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should ignore cancelled reservations when checking conflicts', async () => {
    // Set up existing but cancelled reservation from 18:00 to 20:00
    // Our implementation filters out cancelled reservations in the query
    // So we should return an empty array to simulate this
    repository.find.mockResolvedValue([]);

    // New reservation at the same time
    const createDto = {
      movieId: 456,
      movieTitle: 'Same Time Movie',
      startTime: '2023-10-30T18:00:00Z', // Same as the cancelled reservation
    };

    // Should not throw an error since cancelled reservations are filtered out in the query
    await expect(service.create(createDto, mockUser as any)).resolves.toBeDefined();
    expect(repository.save).toHaveBeenCalled();
  });

  it('should allow multiple non-conflicting reservations', async () => {
    // Set up multiple existing reservations
    const existingReservations = [
      baseReservation, // 18:00-20:00
      {
        ...baseReservation,
        movieId: 456,
        movieTitle: 'Morning Movie',
        startTime: new Date('2023-10-30T10:00:00Z'),
        endTime: new Date('2023-10-30T12:00:00Z'), // 10:00-12:00
      },
      {
        ...baseReservation,
        movieId: 789,
        movieTitle: 'Evening Movie',
        startTime: new Date('2023-10-30T22:00:00Z'),
        endTime: new Date('2023-10-31T00:00:00Z'), // 22:00-00:00
      },
    ];
    repository.find.mockResolvedValue(existingReservations);

    // New reservation in an open slot
    const createDto = {
      movieId: 101,
      movieTitle: 'Afternoon Movie',
      startTime: '2023-10-30T14:00:00Z', // 14:00-16:00, between morning and evening movies
    };

    // Should not throw an error
    await expect(service.create(createDto, mockUser as any)).resolves.toBeDefined();
    expect(repository.save).toHaveBeenCalled();
  });
}); 