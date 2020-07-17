import { CarCategory } from '@app/api/car-category/models/car-category.model';
import { CarCategoryService } from '@app/api/car-category/services/car-category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as paginationRepositoryMock from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

describe('CarCategoryService', () => {
  let carCategoryRepository: Repository<CarCategory>;
  let carCategoryService: CarCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarCategoryService,
        { provide: getRepositoryToken(CarCategory), useClass: Repository },
      ],
    }).compile();

    carCategoryRepository = module.get<Repository<CarCategory>>(
      getRepositoryToken(CarCategory),
    );
    carCategoryService = module.get<CarCategoryService>(CarCategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getCarCategories()', async () => {
    jest
      .spyOn(paginationRepositoryMock, 'paginate')
      .mockImplementationOnce((_, { limit, page, route }) => {
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

    const paginationOptions = {
      page: 1,
      limit: 10,
      route: 'http://localhost:3000/v1/api/car-categories',
    };
    const expected = await carCategoryService.getCarCategories(
      paginationOptions,
    );

    expect(paginationRepositoryMock.paginate).toHaveBeenCalledTimes(1);
    expect(paginationRepositoryMock.paginate).toHaveBeenCalledWith(
      carCategoryRepository,
      paginationOptions,
    );
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

  it('getCarCategoryById()', async () => {
    jest.spyOn(carCategoryRepository, 'findOne').mockImplementationOnce(id => {
      return Promise.resolve({
        id: id as string,
        name: 'big',
        displayName: 'Big',
        createdAt: '2020-07-12T02:41:24.799Z',
        updatedAt: '2020-07-12T02:41:24.799Z',
      });
    });

    const expected = (await carCategoryService.getCarCategoryById(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    )) as CarCategory;

    expect(carCategoryRepository.findOne).toHaveBeenCalledTimes(1);
    expect(carCategoryRepository.findOne).toHaveBeenCalledWith(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'displayName', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.id).toEqual('120bbafd-f26b-4094-8636-65e0aed6d396');
  });

  it('insertCarCategory()', async () => {
    jest
      .spyOn(carCategoryRepository, 'save')
      .mockImplementationOnce(carCategoryDto => {
        return Promise.resolve({
          ...carCategoryDto,
          id: '120bbafd-f26b-4094-8636-65e0aed6d396',
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        } as CarCategory);
      });

    const carCategoryDto = {
      name: 'medium',
      displayName: 'Medium',
    };
    const expected = await carCategoryService.insertCarCategory(carCategoryDto);

    expect(carCategoryRepository.save).toHaveBeenCalledTimes(1);
    expect(carCategoryRepository.save).toHaveBeenCalledWith(carCategoryDto);
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['id', 'name', 'displayName', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.name).toEqual('medium');
    expect(expected.displayName).toEqual('Medium');
  });

  it('updateCarCategory()', async () => {
    jest.spyOn(carCategoryRepository, 'update').mockImplementationOnce(() => {
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
    const expected = await carCategoryService.updateCarCategory(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
      carCategoryDto,
    );

    expect(carCategoryRepository.update).toHaveBeenCalledTimes(1);
    expect(carCategoryRepository.update).toHaveBeenCalledWith(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
      carCategoryDto,
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });

  it('deleteCarCategory()', async () => {
    jest.spyOn(carCategoryRepository, 'delete').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await carCategoryService.deleteCarCategory(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );

    expect(carCategoryRepository.delete).toHaveBeenCalledTimes(1);
    expect(carCategoryRepository.delete).toHaveBeenCalledWith(
      '120bbafd-f26b-4094-8636-65e0aed6d396',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });
});
