import { SupplierController } from '@app/supplier/controllers/supplier.controller';
import { Supplier } from '@app/supplier/models/supplier';
import { SupplierService } from '@app/supplier/services/supplier.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('Supplier Controller', () => {
  let configService: ConfigService;
  let supplierService: SupplierService;
  let supplierController: SupplierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        SupplierService,
        ConfigService,
        { provide: getRepositoryToken(Supplier), useClass: Repository },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    supplierService = module.get<SupplierService>(SupplierService);
    supplierController = module.get<SupplierController>(SupplierController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('index()', async () => {
    jest
      .spyOn(supplierService, 'getSuppliers')
      .mockImplementationOnce(({ limit, page, route }) => {
        return Promise.resolve({
          items: [
            {
              id: 1,
              name: 'Andi',
              phoneNumber: '082124234',
              address: 'Medan, Indonesia',
              createdAt: '2020-07-12T02:41:24.799Z',
              updatedAt: '2020-07-12T02:41:24.799Z',
            },
          ],
          meta: {
            currentPage: page,
            itemCount: 3,
            itemsPerPage: limit,
            totalItems: 3,
            totalPages: 1,
          },
          links: {
            first: `${route}?page=${
              page === 1 ? page : page - 1
            }&limit=${limit}`,
            last: `${route}?page=${page}&limit=${limit}`,
            next: '',
            previous: '',
          },
        });
      });
    jest
      .spyOn(configService, 'get')
      .mockImplementationOnce(() => 'http://localhost:3000/v1/api');

    const expected = await supplierController.index(1, 10);

    expect(supplierService.getSuppliers).toHaveBeenCalledTimes(1);
    expect(supplierService.getSuppliers).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      route: 'http://localhost:3000/v1/api/suppliers',
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
    expect(Object.keys(expected.links).sort()).toEqual(
      ['first', 'last', 'next', 'previous'].sort(),
    );
  });

  it('show()', async () => {
    jest
      .spyOn(supplierService, 'getSupplierById')
      .mockImplementationOnce(id => {
        return Promise.resolve({
          id,
          name: 'Andi',
          phoneNumber: '0824334234',
          address: 'Jakarta, Indonesia',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });

    const expected = await supplierController.show(1);

    expect(supplierService.getSupplierById).toHaveBeenCalledTimes(1);
    expect(supplierService.getSupplierById).toHaveBeenCalledWith(1);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.id).toEqual(1);
  });

  it('store()', async () => {
    jest
      .spyOn(supplierService, 'insertSupplier')
      .mockImplementationOnce(supplierDto => {
        return Promise.resolve({
          ...supplierDto,
          id: 2,
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });

    const supplierDto = {
      name: 'Budi',
      phoneNumber: '0852114342',
      address: 'Medan, Indonesia',
    };
    const expected = await supplierController.store(supplierDto);

    expect(supplierService.insertSupplier).toHaveBeenCalledTimes(1);
    expect(supplierService.insertSupplier).toHaveBeenCalledWith(supplierDto);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('Budi');
    expect(expected.phoneNumber).toEqual('0852114342');
    expect(expected.address).toEqual('Medan, Indonesia');
  });

  it('update()', async () => {
    jest
      .spyOn(supplierService, 'getSupplierById')
      .mockImplementationOnce(id => {
        return Promise.resolve({
          id,
          name: 'Andi',
          phoneNumber: '0824334234',
          address: 'Jakarta, Indonesia',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });
    jest.spyOn(supplierService, 'updateSupplier').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const supplierDto = {
      name: 'Dito',
      phoneNumber: '085257221',
      address: 'Bandung, Indonesia',
    };
    const expected = await supplierController.update(1, supplierDto);

    expect(supplierService.getSupplierById).toHaveBeenCalledTimes(1);
    expect(supplierService.getSupplierById).toHaveBeenCalledWith(1);
    expect(supplierService.updateSupplier).toHaveBeenCalledTimes(1);
    expect(supplierService.updateSupplier).toHaveBeenCalledWith(1, supplierDto);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('Dito');
    expect(expected.phoneNumber).toEqual('085257221');
    expect(expected.address).toEqual('Bandung, Indonesia');
  });

  it('destroy()', async () => {
    jest
      .spyOn(supplierService, 'getSupplierById')
      .mockImplementationOnce(id => {
        return Promise.resolve({
          id,
          name: 'Andi',
          phoneNumber: '0824334234',
          address: 'Jakarta, Indonesia',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });
    jest.spyOn(supplierService, 'deleteSupplier').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await supplierController.destroy(1);

    expect(supplierService.getSupplierById).toHaveBeenCalledTimes(1);
    expect(supplierService.getSupplierById).toHaveBeenCalledWith(1);
    expect(supplierService.deleteSupplier).toHaveBeenCalledTimes(1);
    expect(supplierService.deleteSupplier).toHaveBeenCalledWith(1);
    expect(expected).toBeUndefined();
  });
});
