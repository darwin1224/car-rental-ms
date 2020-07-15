import { AuthController } from '@app/modules/auth/controllers/auth.controller';
import { User } from '@app/modules/user/models/user.model';
import { UserService } from '@app/modules/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_MODULE_OPTIONS } from '@nestjs/jwt/dist/jwt.constants';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

jest.mock('bcryptjs', () => ({
  compareSync: jest.fn(() => true),
}));

describe('Auth Controller', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UserService,
        JwtService,
        {
          provide: JWT_MODULE_OPTIONS,
          useValue: { secretOrPrivateKey: '123456' },
        },
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    authController = module.get<AuthController>(AuthController);
  });

  it('login()', async () => {
    jest
      .spyOn(userService, 'getUserByUsername')
      .mockImplementationOnce(username => {
        return Promise.resolve({
          id: 1,
          name: 'Administrator',
          username,
          password: '123456',
          role: 'admin',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        } as User);
      });
    jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => {
      return '123456789';
    });

    const expected = await authController.login({
      username: 'admin',
      password: '123456',
    });

    expect(userService.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(userService.getUserByUsername).toHaveBeenCalledWith('admin');
    expect(jwtService.sign).toHaveBeenCalledTimes(1);
    expect(jwtService.sign).toHaveBeenCalledWith({
      name: 'Administrator',
      username: 'admin',
      role: 'admin',
    });
    expect(typeof expected === 'object').toEqual(true);
    expect(expected.hasOwnProperty('accessToken')).toEqual(true);
    expect(expected.accessToken).toEqual('123456789');
  });
});
