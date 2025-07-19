import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { ExecutionContext } from '@nestjs/common';

// Мок AuthGuard
const mockAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1, email: 'test@test.com' }; // Мок авторизованного пользователя
    return true;
  },
};

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest
              .fn()
              .mockResolvedValue({ id: 1, email: 'test@test.com' }),
            findAll: jest
              .fn()
              .mockResolvedValue([{ id: 1, email: 'test@test.com' }]),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UserService>(UserService);
  });

  describe('register', () => {
    it('should register a new user and return user data without password', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = await controller.register(dto);

      expect(result).toEqual({ id: 1, email: 'test@test.com' });
      expect(userService.create).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });

  describe('getAll', () => {
    it('should return all users (requires JWT auth)', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([{ id: 1, email: 'test@test.com' }]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  // Проверка декораторов Swagger
  it('should have ApiOperation decorators', () => {
    const registerApiOp = Reflect.getMetadata(
      'swagger/apiOperation',
      UsersController.prototype.register,
    );
    const getAllApiOp = Reflect.getMetadata(
      'swagger/apiOperation',
      UsersController.prototype.findAll,
    );

    expect(registerApiOp).toEqual({ summary: 'Регистрация пользователя' });
    expect(getAllApiOp).toEqual({
      summary: 'Получение списка всех пользователей',
    });
  });
});
