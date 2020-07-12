import { CarCategoryDto } from '@app/car-category/dtos/car-category.dto';
import { CarCategory } from '@app/car-category/models/car-category';
import { CarCategoryService } from '@app/car-category/services/car-category.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('car-categories')
export class CarCategoryController {
  constructor(
    private readonly carCategoryService: CarCategoryService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<CarCategory>> {
    return this.carCategoryService.getCarCategories({
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/car-categories`,
    });
  }

  @Get(':id(\\d+)')
  async show(@Param('id') id: number): Promise<CarCategory> {
    const carCategory = await this.carCategoryService.getCarCategoryById(id);
    if (!carCategory) throw new NotFoundException('Car category not found');
    return carCategory;
  }

  @Post()
  async store(@Body() carCategoryDto: CarCategoryDto): Promise<CarCategory> {
    return this.carCategoryService.insertCarCategory(carCategoryDto);
  }

  @Put(':id(\\d+)')
  async update(
    @Param('id') id: number,
    @Body() carCategoryDto: CarCategoryDto,
  ): Promise<CarCategory> {
    const carCategory = await this.carCategoryService.getCarCategoryById(id);
    if (!carCategory) throw new NotFoundException('Car category not found');

    await this.carCategoryService.updateCarCategory(id, carCategoryDto);

    return { ...carCategory, ...carCategoryDto };
  }

  @Delete(':id(\\d+)')
  @HttpCode(204)
  async destroy(@Param('id') id: number): Promise<void> {
    const carCategory = await this.carCategoryService.getCarCategoryById(id);
    if (!carCategory) throw new NotFoundException('Car category not found');

    await this.carCategoryService.deleteCarCategory(id);
  }
}
