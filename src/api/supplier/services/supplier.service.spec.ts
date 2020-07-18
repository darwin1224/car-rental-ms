import { Supplier } from '@app/api/supplier/models/supplier.model';
import { SupplierService } from '@app/api/supplier/services/supplier.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as paginationRepositoryMock from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

describe('SupplierService', () => {
  let supplierRepository: Repository<Supplier>;
  let supplierService: SupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        { provide: getRepositoryToken(Supplier), useClass: Repository },
      ],
    }).compile();

    supplierRepository = module.get<Repository<Supplier>>(
      getRepositoryToken(Supplier),
    );
    supplierService = module.get<SupplierService>(SupplierService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getSuppliers()', async () => {
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
      route: 'http://localhost:3000/v1/api/suppliers',
    };
    const expected = await supplierService.getSuppliers(paginationOptions);

    expect(paginationRepositoryMock.paginate).toHaveBeenCalledTimes(1);
    expect(paginationRepositoryMock.paginate).toHaveBeenCalledWith(
      supplierRepository,
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
      'http://localhost:3000/v1/api/suppliers?limit=10',
    );
    expect(expected.links.last).toEqual(
      'http://localhost:3000/v1/api/suppliers?page=1&limit=10',
    );
  });

  it('getSupplierById()', async () => {
    jest.spyOn(supplierRepository, 'findOne').mockImplementationOnce(id => {
      return Promise.resolve({
        id: id as string,
        name: 'Andi',
        phoneNumber: '0824334234',
        address: 'Jakarta, Indonesia',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      });
    });

    const expected = (await supplierService.getSupplierById(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    )) as Supplier;

    expect(supplierRepository.findOne).toHaveBeenCalledTimes(1);
    expect(supplierRepository.findOne).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.id).toEqual('6e40805f-4381-402a-bb3e-e3d22fa95d19');
  });

  it('insertSupplier()', async () => {
    jest
      .spyOn(supplierRepository, 'save')
      .mockImplementationOnce(supplierDto => {
        return Promise.resolve({
          ...supplierDto,
          id: '6e40805f-4381-402a-bb3e-e3d22fa95d19',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        } as Supplier);
      });

    const supplierDto = {
      name: 'Budi',
      phoneNumber: '0852114342',
      address: 'Medan, Indonesia',
    };
    const expected = await supplierService.insertSupplier(supplierDto);

    expect(supplierRepository.save).toHaveBeenCalledTimes(1);
    expect(supplierRepository.save).toHaveBeenCalledWith(supplierDto);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('Budi');
    expect(expected.phoneNumber).toEqual('0852114342');
    expect(expected.address).toEqual('Medan, Indonesia');
  });

  it('updateSupplier()', async () => {
    jest.spyOn(supplierRepository, 'update').mockImplementationOnce(() => {
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
    const expected = await supplierService.updateSupplier(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      supplierDto,
    );

    expect(supplierRepository.update).toHaveBeenCalledTimes(1);
    expect(supplierRepository.update).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      supplierDto,
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });

  it('deleteSupplier()', async () => {
    jest.spyOn(supplierRepository, 'delete').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await supplierService.deleteSupplier(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );

    expect(supplierRepository.delete).toHaveBeenCalledTimes(1);
    expect(supplierRepository.delete).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });
});
