import { CarCategoryDto } from '@app/api/car-category/dtos/car-category.dto';
import { CarCategory } from '@app/api/car-category/models/car-category.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CarCategoryService {
  constructor(
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>,
  ) {}

  getCarCategories(
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<CarCategory>> {
    return paginate(this.carCategoryRepository, paginationOptions);
  }

  getCarCategoryById(id: string): Promise<CarCategory | undefined> {
    return this.carCategoryRepository.findOne(id);
  }

  insertCarCategory(carCategoryDto: CarCategoryDto): Promise<CarCategory> {
    return this.carCategoryRepository.save(carCategoryDto);
  }

  updateCarCategory(
    id: string,
    carCategoryDto: CarCategoryDto,
  ): Promise<UpdateResult> {
    return this.carCategoryRepository.update(id, carCategoryDto);
  }

  deleteCarCategory(id: string): Promise<DeleteResult> {
    return this.carCategoryRepository.delete(id);
  }
}
