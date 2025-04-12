import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock Repository
type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = (): MockRepository<Reservation> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: MockRepository<Reservation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get<MockRepository<Reservation>>(getRepositoryToken(Reservation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createReservationDto = {
      movieId: 123,
      movieTitle: 'Test Movie',
      startTime: '2023-10-30T18:00:00Z',
    };
    const user = { id: 1, username: 'testuser', email: 'test@test.com', password: 'password', isActive: true };

    it('should successfully create a reservation when there are no conflicts', async () => {
      // Mock empty user reservations (no conflicts)
      repository.find!.mockResolvedValue([]);
      repository.create!.mockReturnValue({
        userId: user.id,
        movieId: createReservationDto.movieId,
        movieTitle: createReservationDto.movieTitle,
        startTime: new Date(createReservationDto.startTime),
        endTime: new Date(new Date(createReservationDto.startTime).getTime() + 2 * 60 * 60 * 1000),
      } as Reservation);
      repository.save!.mockResolvedValue({
        id: 1,
        userId: user.id,
        movieId: createReservationDto.movieId,
        movieTitle: createReservationDto.movieTitle,
        startTime: new Date(createReservationDto.startTime),
        endTime: new Date(new Date(createReservationDto.startTime).getTime() + 2 * 60 * 60 * 1000),
        isCancelled: false,
        createdAt: new Date(),
      } as Reservation);

      const result = await service.create(createReservationDto, user as any);
      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when there is a time conflict', async () => {
      // Mock existing reservation that conflicts
      const existingReservation = {
        id: 1,
        userId: user.id,
        movieId: 456,
        movieTitle: 'Existing Movie',
        startTime: new Date('2023-10-30T17:30:00Z'),
        endTime: new Date('2023-10-30T19:30:00Z'),
        isCancelled: false,
        createdAt: new Date(),
      } as Reservation;
      repository.find!.mockResolvedValue([existingReservation]);

      await expect(service.create(createReservationDto, user as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllByUser', () => {
    it('should return an array of user reservations', async () => {
      const mockReservations = [{ id: 1, userId: 1, movieTitle: 'Test Movie' }] as Reservation[];
      repository.find!.mockResolvedValue(mockReservations);

      const result = await service.findAllByUser(1);
      expect(result).toEqual(mockReservations);
    });
  });

  describe('findOne', () => {
    it('should return a reservation if found', async () => {
      const mockReservation = { id: 1, userId: 1, movieTitle: 'Test Movie' } as Reservation;
      repository.findOne!.mockResolvedValue(mockReservation);

      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockReservation);
    });

    it('should throw NotFoundException if reservation not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('should mark a reservation as cancelled', async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        movieTitle: 'Test Movie',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        isCancelled: false,
      } as Reservation;
      repository.findOne!.mockResolvedValue(mockReservation);
      repository.save!.mockResolvedValue({ ...mockReservation, isCancelled: true } as Reservation);

      const result = await service.cancel(1, 1);
      expect(result.isCancelled).toBe(true);
    });

    it('should throw BadRequestException if reservation is already cancelled', async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        movieTitle: 'Test Movie',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        isCancelled: true,
      } as Reservation;
      repository.findOne!.mockResolvedValue(mockReservation);

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if movie has already started', async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        movieTitle: 'Test Movie',
        startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        isCancelled: false,
      } as Reservation;
      repository.findOne!.mockResolvedValue(mockReservation);

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });
  });
}); 