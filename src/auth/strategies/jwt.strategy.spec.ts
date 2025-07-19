import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate payload', async () => {
    const payload = { sub: '1', email: 'test@test.com' };
    expect(await strategy.validate(payload)).toEqual({
      userId: '1',
      email: 'test@test.com',
    });
  });
});
