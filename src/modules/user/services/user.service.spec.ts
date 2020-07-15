import { User } from '@app/modules/user/models/user.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as paginationRepositoryMock from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { UserService } from './user.service';

describe('UserService', () => {
  let userRepository: Repository<User>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUsers()', async () => {
    jest
      .spyOn(paginationRepositoryMock, 'paginate')
      .mockImplementationOnce((_, { limit, page, route }) => {
        return Promise.resolve({
          items: [
            {
              id: 1,
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
        });
      });

    const paginationOptions = {
      page: 1,
      limit: 10,
      route: 'http://localhost:3000/v1/api/users',
    };
    const expected = await userService.getUsers(paginationOptions);

    expect(paginationRepositoryMock.paginate).toHaveBeenCalledTimes(1);
    expect(paginationRepositoryMock.paginate).toHaveBeenCalledWith(
      userRepository,
      paginationOptions,
    );
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

  it('getUserByUsername()', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementationOnce(userDto => {
      return Promise.resolve({
        id: 1,
        name: 'Administrator',
        username: userDto?.username,
        password: '123456',
        role: 'admin',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      } as User);
    });

    const expected = (await userService.getUserByUsername('admin')) as User;

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'admin' });
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
    expect(expected.username).toEqual('admin');
  });

  it('getUserById()', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementationOnce(id => {
      return Promise.resolve({
        id: id as number,
        name: 'Administrator',
        username: 'admin',
        password: '123456',
        role: 'admin',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      } as User);
    });

    const expected = (await userService.getUserById(1)) as User;

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith(1);
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
    expect(expected.id).toEqual(1);
  });

  it('insertUser()', async () => {
    jest.spyOn(userRepository, 'save').mockImplementationOnce(userDto => {
      return Promise.resolve({
        ...userDto,
        id: 2,
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
    const expected = await userService.insertUser(userDto);

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(userDto);
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

  it('updateUser()', async () => {
    jest.spyOn(userRepository, 'update').mockImplementationOnce(() => {
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
    const expected = await userService.updateUser(1, userDto);

    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(userRepository.update).toHaveBeenCalledWith(1, userDto);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });

  it('deleteUser()', async () => {
    jest.spyOn(userRepository, 'delete').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await userService.deleteUser(1);

    expect(userRepository.delete).toHaveBeenCalledTimes(1);
    expect(userRepository.delete).toHaveBeenCalledWith(1);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });
});