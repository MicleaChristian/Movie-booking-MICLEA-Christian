import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UserService;

  const mockUserService = {
    // Add any user service methods if needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user data from request', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };

      const mockRequest = {
        user: mockUser,
      };

      const result = await controller.getMe(mockRequest);
      expect(result).toEqual(mockUser);
    });

    it('should throw InternalServerErrorException if user not found in request', async () => {
      const mockRequest = {
        user: null,
      };

      await expect(controller.getMe(mockRequest)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
}); 