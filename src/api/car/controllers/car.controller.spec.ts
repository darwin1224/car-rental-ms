import { CarController } from '@app/api/car/controllers/car.controller';
import { Car } from '@app/api/car/models/car.model';
import { CarService } from '@app/api/car/services/car.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CarController', () => {
  let configService: ConfigService;
  let carService: CarService;
  let carController: CarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        CarService,
        ConfigService,
        { provide: getRepositoryToken(Car), useClass: Repository },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    carService = module.get<CarService>(CarService);
    carController = module.get<CarController>(CarController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('index()', async () => {
    jest
      .spyOn(carService, 'getCars')
      .mockImplementationOnce(({ limit, page, route }) => {
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
    jest
      .spyOn(configService, 'get')
      .mockImplementationOnce(() => 'http://localhost:3000/v1/api');

    const expected = await carController.index(1, 10);

    expect(carService.getCars).toHaveBeenCalledTimes(1);
    expect(carService.getCars).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      route: 'http://localhost:3000/v1/api/cars',
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

  it('show()', async () => {
    jest
      .spyOn(carService, 'getCarByIdWithRelationship')
      .mockImplementationOnce(id => {
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

    const expected = await carController.show(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );

    expect(carService.getCarByIdWithRelationship).toHaveBeenCalledTimes(1);
    expect(carService.getCarByIdWithRelationship).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
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

  it('store()', async () => {
    jest
      .spyOn(carService, 'insertCar')
      .mockImplementationOnce(({ carCategoryId, supplierId, price }) => {
        return Promise.resolve({
          id: '6e40805f-4381-402a-bb3e-e3d22fa95d19',
          carCategory: { id: carCategoryId },
          supplier: { id: supplierId },
          price,
          createdAt: '2020-07-12T02:41:24.799Z',
          updatedAt: '2020-07-12T02:41:24.799Z',
        } as Car);
      });

    const carDto = {
      carCategoryId: 'fb35a65b-8a08-43c7-b0f4-4d5024f69554',
      supplierId: '2157d396-92bc-4434-af8e-d45f75daf640',
      price: '80000',
    };
    const expected = await carController.store(carDto);

    expect(carService.insertCar).toHaveBeenCalledTimes(1);
    expect(carService.insertCar).toHaveBeenCalledWith(carDto);
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

  it('update()', async () => {
    jest.spyOn(carService, 'getCarById').mockImplementationOnce(id => {
      return Promise.resolve({
        id: id as string,
        price: '80000.00',
        createdAt: '2020-07-16T21:27:56.027Z',
        updatedAt: '2020-07-16T21:27:56.027Z',
      } as Car);
    });
    jest.spyOn(carService, 'updateCar').mockImplementationOnce(() => {
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
    const expected = await carController.update(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      carDto,
    );

    expect(carService.getCarById).toHaveBeenCalledTimes(1);
    expect(carService.getCarById).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(carService.updateCar).toHaveBeenCalledTimes(1);
    expect(carService.updateCar).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
      carDto,
    );
    expect(typeof expected === 'object').toEqual(true);
    expect(Object.keys(expected).sort()).toEqual(
      [
        'id',
        'carCategoryId',
        'supplierId',
        'price',
        'createdAt',
        'updatedAt',
      ].sort(),
    );
    expect(expected.carCategoryId).toEqual(
      'fb35a65b-8a08-43c7-b0f4-4d5024f69554',
    );
    expect(expected.supplierId).toEqual('2157d396-92bc-4434-af8e-d45f75daf640');
    expect(expected.price).toEqual('100000');
  });

  it('destroy()', async () => {
    jest.spyOn(carService, 'getCarById').mockImplementationOnce(id => {
      return Promise.resolve({
        id: id as string,
        price: '80000.00',
        createdAt: '2020-07-16T21:27:56.027Z',
        updatedAt: '2020-07-16T21:27:56.027Z',
      } as Car);
    });
    jest.spyOn(carService, 'deleteCar').mockImplementationOnce(() => {
      return Promise.resolve({
        affected: 1,
        generatedMaps: [{ 1: 1 }],
        raw: '',
      });
    });

    const expected = await carController.destroy(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );

    expect(carService.getCarById).toHaveBeenCalledTimes(1);
    expect(carService.getCarById).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(carService.deleteCar).toHaveBeenCalledTimes(1);
    expect(carService.deleteCar).toHaveBeenCalledWith(
      '6e40805f-4381-402a-bb3e-e3d22fa95d19',
    );
    expect(expected).toBeUndefined();
  });
});
