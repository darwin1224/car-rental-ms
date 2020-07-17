import { CarDto } from '@app/api/car/dtos/car.dto';
import { Car } from '@app/api/car/models/car.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  getCars(paginationOptions: IPaginationOptions): Promise<Pagination<Car>> {
    return paginate(this.carRepository, paginationOptions, {
      relations: ['carCategory', 'supplier'],
    });
  }

  getCarById(id: string): Promise<Car | undefined> {
    return this.carRepository.findOne(id);
  }

  getCarByIdWithRelationship(id: string): Promise<Car | undefined> {
    return this.carRepository.findOne(id, {
      relations: ['carCategory', 'supplier'],
    });
  }

  insertCar({ carCategoryId, supplierId, price }: CarDto): Promise<Car> {
    return this.carRepository.save({
      carCategory: { id: carCategoryId },
      supplier: { id: supplierId },
      price,
    });
  }

  updateCar(
    id: string,
    { carCategoryId, supplierId, price }: CarDto,
  ): Promise<UpdateResult> {
    return this.carRepository.update(id, {
      carCategory: { id: carCategoryId },
      supplier: { id: supplierId },
      price,
    });
  }

  deleteCar(id: string): Promise<DeleteResult> {
    return this.carRepository.delete(id);
  }
}
