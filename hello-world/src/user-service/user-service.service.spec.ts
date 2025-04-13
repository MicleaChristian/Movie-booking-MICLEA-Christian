import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceService } from './user-service.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserServiceService', () => {
  let service: UserServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserServiceService],
    }).compile();

    service = module.get<UserServiceService>(UserServiceService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.register(registerData);

      expect(result).toEqual({
        message: 'User registered successfully',
        user: {
          email: registerData.email,
          username: registerData.username,
          password: hashedPassword,
          id: expect.any(Number),
        },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
    });

    it('should handle bcrypt hash error', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash failed'));

      await expect(service.register(registerData)).rejects.toThrow('Hash failed');
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      email: loginData.email,
      username: 'demoUser',
      password: 'hashedPassword123',
      id: 1,
    };

    it('should login user successfully with correct credentials', async () => {
      const mockToken = 'jwt.token.here';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockUser.password);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await service.login(loginData);

      expect(result).toEqual({
        access_token: mockToken,
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: mockUser.id, email: mockUser.email },
        'your_jwt_secret',
        { expiresIn: '1h' },
      );
    });

    it('should throw error for invalid credentials', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockUser.password);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginData)).rejects.toThrow('Invalid credentials');

      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should handle bcrypt compare error', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockUser.password);
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Compare failed'));

      await expect(service.login(loginData)).rejects.toThrow('Compare failed');
    });

    it('should handle jwt sign error', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockUser.password);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error('JWT sign failed');
      });

      await expect(service.login(loginData)).rejects.toThrow('JWT sign failed');
    });
  });
});
