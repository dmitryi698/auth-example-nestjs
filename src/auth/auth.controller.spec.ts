import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn().mockResolvedValue({ access_token: 'mock-token' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const mockUser = { id: 1, email: dto.email };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await controller.login(dto);
      expect(result).toEqual({ access_token: 'mock-token' });
      expect(authService.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'wrong-password',
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(controller.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
    });
  });
});
