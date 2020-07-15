import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('validate()', () => {
    const expected = jwtStrategy.validate({
      name: 'Administrator',
      username: 'admin',
      role: 'admin',
    });

    expect(typeof expected === 'object').toEqual(true);
    expect(expected).toEqual({
      name: 'Administrator',
      username: 'admin',
      role: 'admin',
    });
  });
});
