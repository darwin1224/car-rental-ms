import { ClientController } from '@app/api/client/controllers/client.controller';
import { Client } from '@app/api/client/models/client.model';
import { ClientService } from '@app/api/client/services/client.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ClientController', () => {
  let configService: ConfigService;
  let clientService: ClientService;
  let clientController: ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        ClientService,
        ConfigService,
        { provide: getRepositoryToken(Client), useClass: Repository },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    clientService = module.get<ClientService>(ClientService);
    clientController = module.get<ClientController>(ClientController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('index()', async () => {
    jest
      .spyOn(clientService, 'getClients')
      .mockImplementationOnce(({ limit, page, route }) => {
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
    jest
      .spyOn(configService, 'get')
      .mockImplementationOnce(() => 'http://localhost:3000/v1/api');

    const expected = await clientController.index(1, 10);

    expect(clientService.getClients).toHaveBeenCalledTimes(1);
    expect(clientService.getClients).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      route: 'http://localhost:3000/v1/api/clients',
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

  it('show()', async () => {
    jest.spyOn(clientService, 'getClientById').mockImplementationOnce(id => {
      return Promise.resolve({
        id,
        name: 'Andi',
        phoneNumber: '0824334234',
        address: 'Jakarta, Indonesia',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      });
    });

    const expected = await clientController.show(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );

    expect(clientService.getClientById).toHaveBeenCalledTimes(1);
    expect(clientService.getClientById).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.id).toEqual('6e40805f-4381-402a-bb3e-e3d22fa95d19');
  });

  it('store()', async () => {
    jest
      .spyOn(clientService, 'insertClient')
      .mockImplementationOnce(clientDto => {
        return Promise.resolve({
          ...clientDto,
          id: '6e40805f-4381-402a-bb3e-e3d22fa95d19',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });

    const clientDto = {
      name: 'Budi',
      phoneNumber: '0852114342',
      address: 'Medan, Indonesia',
    };
    const expected = await clientController.store(clientDto);

    expect(clientService.insertClient).toHaveBeenCalledTimes(1);
    expect(clientService.insertClient).toHaveBeenCalledWith(clientDto);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('Budi');
    expect(expected.phoneNumber).toEqual('0852114342');
    expect(expected.address).toEqual('Medan, Indonesia');
  });

  it('update()', async () => {
    jest.spyOn(clientService, 'getClientById').mockImplementationOnce(id => {
      return Promise.resolve({
        id,
        name: 'Andi',
        phoneNumber: '0824334234',
        address: 'Jakarta, Indonesia',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      });
    });
    jest.spyOn(clientService, 'updateClient').mockImplementationOnce(() => {
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
    const expected = await clientController.update(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      clientDto,
    );

    expect(clientService.getClientById).toHaveBeenCalledTimes(1);
    expect(clientService.getClientById).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(clientService.updateClient).toHaveBeenCalledTimes(1);
    expect(clientService.updateClient).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      clientDto,
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('Dito');
    expect(expected.phoneNumber).toEqual('085257221');
    expect(expected.address).toEqual('Bandung, Indonesia');
  });

  it('destroy()', async () => {
    jest.spyOn(clientService, 'getClientById').mockImplementationOnce(id => {
      return Promise.resolve({
        id,
        name: 'Andi',
        phoneNumber: '0824334234',
        address: 'Jakarta, Indonesia',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      });
    });
    jest.spyOn(clientService, 'deleteClient').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await clientController.destroy(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );

    expect(clientService.getClientById).toHaveBeenCalledTimes(1);
    expect(clientService.getClientById).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(clientService.deleteClient).toHaveBeenCalledTimes(1);
    expect(clientService.deleteClient).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(expected).toBeUndefined();
  });
});
