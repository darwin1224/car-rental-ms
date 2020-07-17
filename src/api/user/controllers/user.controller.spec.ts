import { UserController } from '@app/api/user/controllers/user.controller';
import { User } from '@app/api/user/models/user.model';
import { UserService } from '@app/api/user/services/user.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

describe('UserController', () => {
  let configService: ConfigService;
  let userService: UserService;
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        ConfigService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('index()', async () => {
    jest
      .spyOn(userService, 'getUsers')
      .mockImplementationOnce(({ limit, page, route }) => {
        return Promise.resolve({
          items: [
            {
              id: 'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
              name: 'Administrator',
              username: 'admin',
              password: '123456',
              role: 'admin',
              createdAt: '2020-07-12T02:41:24.799Z',
              updatedAt: '2020-07-12T02:41:24.799Z',
            },
          ],
          meta: {
            currentPage: page,
            itemCount: 1,
            itemsPerPage: limit,
            totalItems: 1,
            totalPages: 1,
          },
          links: {
            first: `${route}?limit=${limit}`,
            last: `${route}?page=${page}&limit=${limit}`,
            next: '',
            previous: '',
          },
        } as Pagination<User>);
      });
    jest
      .spyOn(configService, 'get')
      .mockImplementationOnce(() => 'http://localhost:3000/v1/api');

    const expected = await userController.index(1, 10);

    expect(userService.getUsers).toHaveBeenCalledTimes(1);
    expect(userService.getUsers).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      route: 'http://localhost:3000/v1/api/users',
    });
    expect(configService.get).toHaveBeenCalledTimes(1);
    expect(Object.keys(expected).sort()).toEqual(
      ['items', 'meta', 'links'].sort(),
    );
    expect(Array.isArray(expected.items)).toEqual(true);
    expected.items.forEach(item => {
      expect(Object.keys(item).sort()).toEqual(
        [
          'id',
          'name',
          'username',
          'password',
          'role',
          'createdAt',
          'updatedAt',
        ].sort(),
      );
    });
    expect(Object.keys(expected.meta).sort()).toEqual(
      [
        'currentPage',
        'itemCount',
        'itemsPerPage',
        'totalItems',
        'totalPages',
      ].sort(),
    );
    expect(expected.meta.currentPage).toEqual(1);
    expect(expected.meta.itemsPerPage).toEqual(10);
    expect(expected.meta.itemCount).toEqual(expected.items.length);
    expect(expected.meta.totalItems).toEqual(expected.items.length);
    expect(Object.keys(expected.links).sort()).toEqual(
      ['first', 'last', 'next', 'previous'].sort(),
    );
    expect(expected.links.first).toEqual(
      'http://localhost:3000/v1/api/users?limit=10',
    );
    expect(expected.links.last).toEqual(
      'http://localhost:3000/v1/api/users?page=1&limit=10',
    );
  });

  it('show()', async () => {
    jest.spyOn(userService, 'getUserById').mockImplementationOnce(id => {
      return Promise.resolve({
        id,
        name: 'Administrator',
        username: 'admin',
        password: '123456',
        role: 'admin',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      } as User);
    });

    const expected = await userController.show(
      'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
    );

    expect(userService.getUserById).toHaveBeenCalledTimes(1);
    expect(userService.getUserById).toHaveBeenCalledWith(
      'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      [
        'id',
        'name',
        'username',
        'password',
        'role',
        'createdAt',
        'updatedAt',
      ].sort(),
    );
    expect(expected.id).toEqual('f82c6f2e-0663-4083-90da-bdd1e3825ed4');
  });

  it('store()', async () => {
    jest.spyOn(userService, 'insertUser').mockImplementationOnce(userDto => {
      return Promise.resolve({
        ...userDto,
        id: 'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      } as User);
    });

    const userDto = {
      name: 'Andi',
      username: 'andi',
      password: '123456',
      role: 'cashier',
    };
    const expected = await userController.store(userDto);

    expect(userService.insertUser).toHaveBeenCalledTimes(1);
    expect(userService.insertUser).toHaveBeenCalledWith(userDto);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      [
        'id',
        'name',
        'username',
        'password',
        'role',
        'createdAt',
        'updatedAt',
      ].sort(),
    );
    expect(expected.name).toEqual('Andi');
    expect(expected.username).toEqual('andi');
    expect(expected.password).toEqual('123456');
    expect(expected.role).toEqual('cashier');
  });

  it('update()', async () => {
    jest.spyOn(userService, 'getUserById').mockImplementationOnce(id => {
      return Promise.resolve({
        id,
        name: 'Administrator',
        username: 'admin',
        password: '123456',
        role: 'admin',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      } as User);
    });
    jest.spyOn(userService, 'updateUser').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const userDto = {
      name: 'Budi',
      username: 'budi',
      password: '123456',
      role: 'cashier',
    };
    const expected = await userController.update(
      'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
      userDto,
    );

    expect(userService.getUserById).toHaveBeenCalledTimes(1);
    expect(userService.getUserById).toHaveBeenCalledWith(
      'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
    );
    expect(userService.updateUser).toHaveBeenCalledTimes(1);
    expect(userService.updateUser).toHaveBeenCalledWith(
      'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
      userDto,
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      [
        'id',
        'name',
        'username',
        'password',
        'role',
        'createdAt',
        'updatedAt',
      ].sort(),
    );
    expect(expected.name).toEqual('Budi');
    expect(expected.username).toEqual('budi');
    expect(expected.password).toEqual('123456');
    expect(expected.role).toEqual('cashier');
  });

  it('destroy()', async () => {
    jest.spyOn(userService, 'getUserById').mockImplementationOnce(id => {
      return Promise.resolve({
        id,
        name: 'Administrator',
        username: 'admin',
        password: '123456',
        role: 'admin',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      } as User);
    });
    jest.spyOn(userService, 'deleteUser').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await userController.destroy(
      'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
    );

    expect(userService.getUserById).toHaveBeenCalledTimes(1);
    expect(userService.getUserById).toHaveBeenCalledWith(
      'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
    );
    expect(userService.deleteUser).toHaveBeenCalledTimes(1);
    expect(userService.deleteUser).toHaveBeenCalledWith(
      'f82c6f2e-0663-4083-90da-bdd1e3825ed4',
    );
    expect(expected).toBeUndefined();
  });
});
