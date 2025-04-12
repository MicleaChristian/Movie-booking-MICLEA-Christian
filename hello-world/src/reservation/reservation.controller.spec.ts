import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservationService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    cancel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation successfully', async () => {
      const createDto: CreateReservationDto = {
        movieId: 123,
        movieTitle: 'Test Movie',
        startTime: '2023-10-30T18:00:00Z',
      };
      const user = { id: 1, username: 'testuser' };
      const expectedResult = {
        id: 1,
        userId: 1,
        movieId: 123,
        movieTitle: 'Test Movie',
        startTime: new Date('2023-10-30T18:00:00Z'),
        endTime: new Date('2023-10-30T20:00:00Z'),
        isCancelled: false,
      };

      mockReservationService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, { user });

      expect(result).toEqual(expectedResult);
      expect(mockReservationService.create).toHaveBeenCalledWith(createDto, user);
    });

    it('should handle errors during reservation creation', async () => {
      const createDto: CreateReservationDto = {
        movieId: 123,
        movieTitle: 'Test Movie',
        startTime: '2023-10-30T18:00:00Z',
      };
      const user = { id: 1, username: 'testuser' };
      const errorMessage = 'Time conflict with existing reservation';

      mockReservationService.create.mockRejectedValue(new BadRequestException(errorMessage));

      await expect(controller.create(createDto, { user })).rejects.toThrow(BadRequestException);
      expect(mockReservationService.create).toHaveBeenCalledWith(createDto, user);
    });
  });

  describe('findAll', () => {
    it('should return all reservations for the user', async () => {
      const user = { id: 1, username: 'testuser' };
      const expectedReservations = [
        {
          id: 1,
          userId: 1,
          movieId: 123,
          movieTitle: 'Test Movie 1',
          startTime: new Date(),
        },
        {
          id: 2,
          userId: 1,
          movieId: 456,
          movieTitle: 'Test Movie 2',
          startTime: new Date(),
        },
      ];

      mockReservationService.findAllByUser.mockResolvedValue(expectedReservations);

      const result = await controller.findAll({ user });

      expect(result).toEqual(expectedReservations);
      expect(mockReservationService.findAllByUser).toHaveBeenCalledWith(user.id);
    });
  });

  describe('findOne', () => {
    it('should return a specific reservation', async () => {
      const user = { id: 1, username: 'testuser' };
      const reservationId = 1;
      const expectedReservation = {
        id: reservationId,
        userId: 1,
        movieId: 123,
        movieTitle: 'Test Movie',
        startTime: new Date(),
      };

      mockReservationService.findOne.mockResolvedValue(expectedReservation);

      const result = await controller.findOne(reservationId, { user });

      expect(result).toEqual(expectedReservation);
      expect(mockReservationService.findOne).toHaveBeenCalledWith(reservationId, user.id);
    });

    it('should handle not found reservation', async () => {
      const user = { id: 1, username: 'testuser' };
      const reservationId = 999;

      mockReservationService.findOne.mockRejectedValue(
        new NotFoundException(`Reservation with ID ${reservationId} not found`)
      );

      await expect(controller.findOne(reservationId, { user })).rejects.toThrow(NotFoundException);
      expect(mockReservationService.findOne).toHaveBeenCalledWith(reservationId, user.id);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation successfully', async () => {
      const user = { id: 1, username: 'testuser' };
      const reservationId = 1;
      const cancelledReservation = {
        id: reservationId,
        userId: 1,
        movieId: 123,
        movieTitle: 'Test Movie',
        startTime: new Date(),
        isCancelled: true,
      };

      mockReservationService.cancel.mockResolvedValue(cancelledReservation);

      const result = await controller.cancel(reservationId, { user });

      expect(result).toEqual(cancelledReservation);
      expect(mockReservationService.cancel).toHaveBeenCalledWith(reservationId, user.id);
    });

    it('should handle errors when cancelling', async () => {
      const user = { id: 1, username: 'testuser' };
      const reservationId = 1;
      const errorMessage = 'Cannot cancel a reservation that has already started';

      mockReservationService.cancel.mockRejectedValue(new BadRequestException(errorMessage));

      await expect(controller.cancel(reservationId, { user })).rejects.toThrow(BadRequestException);
      expect(mockReservationService.cancel).toHaveBeenCalledWith(reservationId, user.id);
    });
  });
}); 