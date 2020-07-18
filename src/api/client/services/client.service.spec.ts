import { Client } from '@app/api/client/models/client.model';
import { ClientService } from '@app/api/client/services/client.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as paginationRepositoryMock from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

describe('ClientService', () => {
  let clientRepository: Repository<Client>;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: getRepositoryToken(Client), useClass: Repository },
      ],
    }).compile();

    clientRepository = module.get<Repository<Client>>(
      getRepositoryToken(Client),
    );
    clientService = module.get<ClientService>(ClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getClients()', async () => {
    jest
      .spyOn(paginationRepositoryMock, 'paginate')
      .mockImplementationOnce((_, { limit, page, route }) => {
        return Promise.resolve({
          items: [
            {
              id: '6e40805f-4381-402a-bb3e-e3d22fa95d19',
              name: 'Andi',
              phoneNumber: '082124234',
              address: 'Medan, Indonesia',
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
      route: 'http://localhost:3000/v1/api/clients',
    };
    const expected = await clientService.getClients(paginationOptions);

    expect(paginationRepositoryMock.paginate).toHaveBeenCalledTimes(1);
    expect(paginationRepositoryMock.paginate).toHaveBeenCalledWith(
      clientRepository,
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
          'phoneNumber',
          'address',
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
      'http://localhost:3000/v1/api/clients?limit=10',
    );
    expect(expected.links.last).toEqual(
      'http://localhost:3000/v1/api/clients?page=1&limit=10',
    );
  });

  it('getClientById()', async () => {
    jest.spyOn(clientRepository, 'findOne').mockImplementationOnce(id => {
      return Promise.resolve({
        id: id as string,
        name: 'Andi',
        phoneNumber: '0824334234',
        address: 'Jakarta, Indonesia',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      });
    });

    const expected = (await clientService.getClientById(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    )) as Client;

    expect(clientRepository.findOne).toHaveBeenCalledTimes(1);
    expect(clientRepository.findOne).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.id).toEqual('6e40805f-4381-402a-bb3e-e3d22fa95d19');
  });

  it('insertClient()', async () => {
    jest.spyOn(clientRepository, 'save').mockImplementationOnce(clientDto => {
      return Promise.resolve({
        ...clientDto,
        id: '6e40805f-4381-402a-bb3e-e3d22fa95d19',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      } as Client);
    });

    const clientDto = {
      name: 'Budi',
      phoneNumber: '0852114342',
      address: 'Medan, Indonesia',
    };
    const expected = await clientService.insertClient(clientDto);

    expect(clientRepository.save).toHaveBeenCalledTimes(1);
    expect(clientRepository.save).toHaveBeenCalledWith(clientDto);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('Budi');
    expect(expected.phoneNumber).toEqual('0852114342');
    expect(expected.address).toEqual('Medan, Indonesia');
  });

  it('updateClient()', async () => {
    jest.spyOn(clientRepository, 'update').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const clientDto = {
      name: 'Dito',
      phoneNumber: '085257221',
      address: 'Bandung, Indonesia',
    };
    const expected = await clientService.updateClient(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      clientDto,
    );

    expect(clientRepository.update).toHaveBeenCalledTimes(1);
    expect(clientRepository.update).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      clientDto,
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });

  it('deleteClient()', async () => {
    jest.spyOn(clientRepository, 'delete').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await clientService.deleteClient(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );

    expect(clientRepository.delete).toHaveBeenCalledTimes(1);
    expect(clientRepository.delete).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });
});
