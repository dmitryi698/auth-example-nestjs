import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Kysely } from 'kysely';
import { DB } from '@entity/db';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let db: Kysely<DB>;

  // Моки для цепочек вызовов Kysely
  const mockInsertInto = {
    values: jest.fn().mockReturnThis(),
    returningAll: jest.fn().mockReturnThis(),
    execute: jest
      .fn()
      .mockResolvedValue([
        { id: 1, email: 'test@test.com', password: 'hashed-password' },
      ]),
  };

  const mockSelectFrom = {
    selectAll: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    executeTakeFirst: jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashed-password',
    }),
    execute: jest.fn().mockResolvedValue([{ id: 1, email: 'test@test.com' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'KyselyModuleConnectionToken', // Используем правильный токен
          useValue: {
            insertInto: jest.fn().mockReturnValue(mockInsertInto),
            selectFrom: jest.fn().mockReturnValue(mockSelectFrom),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    db = module.get<Kysely<DB>>('KyselyModuleConnectionToken');
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const email = 'test@test.com';
      const password = 'password';

      // Мокируем bcrypt.hash с помощью jest.spyOn
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashed-password'));

      const result = await userService.create(email, password);

      expect(result).toEqual({ id: 1, email, password: 'hashed-password' });
      expect(db.insertInto).toHaveBeenCalledWith('user');
      expect(mockInsertInto.values).toHaveBeenCalledWith({
        email,
        password: 'hashed-password',
      });

      // Восстанавливаем оригинальный метод bcrypt.hash
      jest.restoreAllMocks();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@test.com';
      const result = await userService.findByEmail(email);

      expect(result).toEqual({ id: 1, email, password: 'hashed-password' });
      expect(db.selectFrom).toHaveBeenCalledWith('user');
      expect(mockSelectFrom.where).toHaveBeenCalledWith('email', '=', email);
    });

    it('should return undefined if user is not found', async () => {
      mockSelectFrom.executeTakeFirst.mockResolvedValue(undefined);

      const result = await userService.findByEmail('nonexistent@test.com');
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      mockSelectFrom.execute.mockResolvedValue([
        { id: 1, email: 'test@test.com' },
      ]);

      const result = await userService.findAll();
      expect(result).toEqual([{ id: 1, email: 'test@test.com' }]);
      expect(db.selectFrom).toHaveBeenCalledWith('user');
      expect(mockSelectFrom.select).toHaveBeenCalledWith(['id', 'email']);
    });
  });
});
