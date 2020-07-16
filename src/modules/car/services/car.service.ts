import { CarDto } from '@app/modules/car/dtos/car.dto';
import { Car } from '@app/modules/car/models/car.model';
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
    return this.carRepository.findOne(id, {
      relations: ['carCategory', 'supplier'],
    });
  }

  insertCar(carDto: CarDto): Promise<Car> {
    return this.carRepository.save(carDto);
  }

  updateCar(id: string, carDto: CarDto): Promise<UpdateResult> {
    return this.carRepository.update(id, carDto);
  }

  deleteCar(id: string): Promise<DeleteResult> {
    return this.carRepository.delete(id);
  }
}
