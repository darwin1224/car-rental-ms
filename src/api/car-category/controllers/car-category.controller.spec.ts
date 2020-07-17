import { CarCategoryController } from '@app/api/car-category/controllers/car-category.controller';
import { CarCategory } from '@app/api/car-category/models/car-category.model';
import { CarCategoryService } from '@app/api/car-category/services/car-category.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CarCategoryController', () => {
  let configService: ConfigService;
  let carCategoryService: CarCategoryService;
  let carCategoryController: CarCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarCategoryController],
      providers: [
        CarCategoryService,
        ConfigService,
        { provide: getRepositoryToken(CarCategory), useClass: Repository },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    carCategoryService = module.get<CarCategoryService>(CarCategoryService);
    carCategoryController = module.get<CarCategoryController>(
      CarCategoryController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('index()', async () => {
    jest
      .spyOn(carCategoryService, 'getCarCategories')
      .mockImplementationOnce(({ limit, page, route }) => {
        return Promise.resolve({
          items: [
            {
              id: '120bbafd-f26b-4094-8636-65e0aed6d396',
              name: 'big',
              displayName: 'Big',
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

    const expected = await carCategoryController.index(1, 10);

    expect(carCategoryService.getCarCategories).toHaveBeenCalledTimes(1);
    expect(carCategoryService.getCarCategories).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      route: 'http://localhost:3000/v1/api/car-categories',
    });
    expect(configService.get).toHaveBeenCalledTimes(1);
    expect(Object.keys(expected).sort()).toEqual(
      ['items', 'meta', 'links'].sort(),
    );
    expect(Array.isArray(expected.items)).toEqual(true);
    expected.items.forEach(item => {
      expect(Object.keys(item).sort()).toEqual(
        ['id', 'name', 'displayName', 'createdAt', 'updatedAt'].sort(),
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
      'http://localhost:3000/v1/api/car-categories?limit=10',
    );
    expect(expected.links.last).toEqual(
      'http://localhost:3000/v1/api/car-categories?page=1&limit=10',
    );
  });

  it('show()', async () => {
    jest
      .spyOn(carCategoryService, 'getCarCategoryById')
      .mockImplementationOnce(id => {
        return Promise.resolve({
          id,
          name: 'big',
          displayName: 'Big',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });

    const expected = await carCategoryController.show(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );

    expect(carCategoryService.getCarCategoryById).toHaveBeenCalledTimes(1);
    expect(carCategoryService.getCarCategoryById).toHaveBeenCalledWith(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'displayName', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.id).toEqual('120bbafd-f26b-4094-8636-65e0aed6d396');
  });

  it('store()', async () => {
    jest
      .spyOn(carCategoryService, 'insertCarCategory')
      .mockImplementationOnce(carCategoryDto => {
        return Promise.resolve({
          ...carCategoryDto,
          id: '120bbafd-f26b-4094-8636-65e0aed6d396',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });

    const carCategoryDto = {
      name: 'medium',
      displayName: 'Medium',
    };
    const expected = await carCategoryController.store(carCategoryDto);

    expect(carCategoryService.insertCarCategory).toHaveBeenCalledTimes(1);
    expect(carCategoryService.insertCarCategory).toHaveBeenCalledWith(
      carCategoryDto,
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'displayName', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('medium');
    expect(expected.displayName).toEqual('Medium');
  });

  it('update()', async () => {
    jest
      .spyOn(carCategoryService, 'getCarCategoryById')
      .mockImplementationOnce(id => {
        return Promise.resolve({
          id,
          name: 'big',
          displayName: 'Big',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });
    jest
      .spyOn(carCategoryService, 'updateCarCategory')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          affected: 1,
          generatedMaps: [{ 1: 1 }],
          raw: '',
        });
      });

    const carCategoryDto = {
      name: 'small',
      displayName: 'Small',
    };
    const expected = await carCategoryController.update(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
      carCategoryDto,
    );

    expect(carCategoryService.getCarCategoryById).toHaveBeenCalledTimes(1);
    expect(carCategoryService.getCarCategoryById).toHaveBeenCalledWith(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );
    expect(carCategoryService.updateCarCategory).toHaveBeenCalledTimes(1);
    expect(carCategoryService.updateCarCategory).toHaveBeenCalledWith(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
      carCategoryDto,
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'displayName', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('small');
    expect(expected.displayName).toEqual('Small');
  });

  it('destroy()', async () => {
    jest
      .spyOn(carCategoryService, 'getCarCategoryById')
      .mockImplementationOnce(id => {
        return Promise.resolve({
          id,
          name: 'big',
          displayName: 'Big',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        });
      });
    jest
      .spyOn(carCategoryService, 'deleteCarCategory')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          affected: 1,
          generatedMaps: [{ 1: 1 }],
          raw: '',
        });
      });

    const expected = await carCategoryController.destroy(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );

    expect(carCategoryService.getCarCategoryById).toHaveBeenCalledTimes(1);
    expect(carCategoryService.getCarCategoryById).toHaveBeenCalledWith(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );
    expect(carCategoryService.deleteCarCategory).toHaveBeenCalledTimes(1);
    expect(carCategoryService.deleteCarCategory).toHaveBeenCalledWith(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );
    expect(expected).toBeUndefined();
  });
});
