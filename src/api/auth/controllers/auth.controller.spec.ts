import { AuthController } from '@app/api/auth/controllers/auth.controller';
import { User } from '@app/api/user/models/user.model';
import { UserService } from '@app/api/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_MODULE_OPTIONS } from '@nestjs/jwt/dist/jwt.constants';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';

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
          id: 'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
          name: 'Administrator',
          username,
          password: '123456',
          role: 'admin',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        } as User);
      });
    const mockCompareSync = jest.fn(() => true);
    (bcryptjs.compareSync as jest.Mock) = mockCompareSync;
    jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => {
      return '123456789';
    });

    const expected = await authController.login({
      username: 'admin',
      password: '123456',
    });

    expect(userService.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(userService.getUserByUsername).toHaveBeenCalledWith('admin');
    expect(mockCompareSync).toHaveBeenCalledTimes(1);
    expect(mockCompareSync).toHaveBeenCalledWith('123456', '123456');
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
