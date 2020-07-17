import { Car } from '@app/api/car/models/car.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as paginationRepositoryMock from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CarService } from './car.service';

describe('CarService', () => {
  let carRepository: Repository<Car>;
  let carService: CarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        { provide: getRepositoryToken(Car), useClass: Repository },
      ],
    }).compile();

    carRepository = module.get<Repository<Car>>(getRepositoryToken(Car));
    carService = module.get<CarService>(CarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getCars()', async () => {
    jest
      .spyOn(paginationRepositoryMock, 'paginate')
      .mockImplementationOnce((_, { limit, page, route }) => {
        return Promise.resolve({
          items: [
            {
              id: '36343ded-9584-40c3-a867-0b157d68b2fc',
              price: '50000.00',
              createdAt: '2020-07-12T02:41:24.799Z',
              updatedAt: '2020-07-12T02:41:24.799Z',
              carCategory: {
                id: 'fb35a65b-8a08-43c7-b0f4-4d5024f69554',
                name: 'big',
                displayName: 'Big',
                createdAt: '2020-07-16T21:26:19.047Z',
                updatedAt: '2020-07-16T21:26:19.047Z',
              },
              supplier: {
                id: '2157d396-92bc-4434-af8e-d45f75daf640',
                name: 'Andi',
                phoneNumber: '08212725723',
                address: 'Jakarta, Indonesia',
                createdAt: '2020-07-16T21:27:03.867Z',
                updatedAt: '2020-07-16T21:27:03.867Z',
              },
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
      route: 'http://localhost:3000/v1/api/cars',
    };
    const expected = await carService.getCars(paginationOptions);

    expect(paginationRepositoryMock.paginate).toHaveBeenCalledTimes(1);
    expect(paginationRepositoryMock.paginate).toHaveBeenCalledWith(
      carRepository,
      paginationOptions,
      {
        relations: ['carCategory', 'supplier'],
      },
    );
    expect(Object.keys(expected).sort()).toEqual(
      ['items', 'meta', 'links'].sort(),
    );
    expect(Array.isArray(expected.items)).toEqual(true);
    expected.items.forEach(item => {
      expect(Object.keys(item).sort()).toEqual(
        [
          'id',
          'price',
          'createdAt',
          'updatedAt',
          'carCategory',
          'supplier',
        ].sort(),
      );
      expect(Object.keys(item.carCategory).sort()).toEqual(
        ['id', 'name', 'displayName', 'createdAt', 'updatedAt'].sort(),
      );
      expect(Object.keys(item.supplier).sort()).toEqual(
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
      'http://localhost:3000/v1/api/cars?limit=10',
    );
    expect(expected.links.last).toEqual(
      'http://localhost:3000/v1/api/cars?page=1&limit=10',
    );
  });

  it('getCarById()', async () => {
    jest.spyOn(carRepository, 'findOne').mockImplementationOnce(id => {
      return Promise.resolve({
        id: id as string,
        price: '80000.00',
        createdAt: '2020-07-16T21:27:56.027Z',
        updatedAt: '2020-07-16T21:27:56.027Z',
        carCategory: {
          id: 'fb35a65b-8a08-43c7-b0f4-4d5024f69554',
          name: 'big',
          displayName: 'Big',
          createdAt: '2020-07-16T21:26:19.047Z',
          updatedAt: '2020-07-16T21:26:19.047Z',
        },
        supplier: {
          id: '2157d396-92bc-4434-af8e-d45f75daf640',
          name: 'Andi',
          phoneNumber: '08212725723',
          address: 'Jakarta, Indonesia',
          createdAt: '2020-07-16T21:27:03.867Z',
          updatedAt: '2020-07-16T21:27:03.867Z',
        },
      });
    });

    const expected = (await carService.getCarByIdWithRelationship(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    )) as Car;

    expect(carRepository.findOne).toHaveBeenCalledTimes(1);
    expect(carRepository.findOne).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      {
        relations: ['carCategory', 'supplier'],
      },
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      [
        'id',
        'price',
        'createdAt',
        'updatedAt',
        'carCategory',
        'supplier',
      ].sort(),
    );
    expect(Object.keys(expected.carCategory).sort()).toEqual(
      ['id', 'name', 'displayName', 'createdAt', 'updatedAt'].sort(),
    );
    expect(Object.keys(expected.supplier).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expected.id).toEqual('6e40805f-4381-402a-bb3e-e3d22fa95d19');
  });

  it('insertCar()', async () => {
    jest.spyOn(carRepository, 'save').mockImplementationOnce(carDto => {
      return Promise.resolve({
        ...carDto,
        id: '6e40805f-4381-402a-bb3e-e3d22fa95d19',
        createdAt: '2020-07-16T21:27:56.027Z',
        updatedAt: '2020-07-16T21:27:56.027Z',
      } as Car);
    });

    const carDto = {
      carCategoryId: 'fb35a65b-8a08-43c7-b0f4-4d5024f69554',
      supplierId: '2157d396-92bc-4434-af8e-d45f75daf640',
      price: '80000',
    };
    const expected = await carService.insertCar(carDto);

    expect(carRepository.save).toHaveBeenCalledTimes(1);
    expect(carRepository.save).toHaveBeenCalledWith({
      carCategory: { id: carDto.carCategoryId },
      supplier: { id: carDto.supplierId },
      price: carDto.price,
    });
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      [
        'id',
        'carCategory',
        'supplier',
        'price',
        'createdAt',
        'updatedAt',
      ].sort(),
    );
    expect(expected.carCategory.hasOwnProperty('id')).toEqual(true);
    expect(expected.supplier.hasOwnProperty('id')).toEqual(true);
    expect(expected.carCategory.id).toEqual(
      'fb35a65b-8a08-43c7-b0f4-4d5024f69554',
    );
    expect(expected.supplier.id).toEqual(
      '2157d396-92bc-4434-af8e-d45f75daf640',
    );
    expect(expected.price).toEqual('80000');
  });

  it('updateCar()', async () => {
    jest.spyOn(carRepository, 'update').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const carDto = {
      carCategoryId: 'fb35a65b-8a08-43c7-b0f4-4d5024f69554',
      supplierId: '2157d396-92bc-4434-af8e-d45f75daf640',
      price: '100000',
    };
    const expected = await carService.updateCar(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      carDto,
    );

    expect(carRepository.update).toHaveBeenCalledTimes(1);
    expect(carRepository.update).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      {
        carCategory: { id: carDto.carCategoryId },
        supplier: { id: carDto.supplierId },
        price: carDto.price,
      },
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });

  it('deleteCar()', async () => {
    jest.spyOn(carRepository, 'delete').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await carService.deleteCar(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );

    expect(carRepository.delete).toHaveBeenCalledTimes(1);
    expect(carRepository.delete).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      ['affected', 'generatedMaps', 'raw'].sort(),
    );
  });
});
