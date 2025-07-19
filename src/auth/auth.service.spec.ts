import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        'test@test.com',
        'password',
      );
      expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(undefined); // Исправлено: undefined вместо null

      const result = await authService.validateUser(
        'test@test.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        'test@test.com',
        'wrong-password',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      const result = await authService.login(mockUser);

      expect(result).toEqual({ access_token: 'mock-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });
  });
});
