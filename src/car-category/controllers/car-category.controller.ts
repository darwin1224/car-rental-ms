import { CarCategoryDto } from '@app/car-category/dtos/car-category.dto';
import { CarCategory } from '@app/car-category/models/car-category.model';
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
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('car-category')
@Controller('car-categories')
export class CarCategoryController {
  constructor(
    private readonly carCategoryService: CarCategoryService,
    private readonly configService: ConfigService,
  ) {}

  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
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

  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(':id(\\d+)')
  async show(@Param('id') id: number): Promise<CarCategory> {
    const carCategory = await this.carCategoryService.getCarCategoryById(id);
    if (!carCategory) throw new NotFoundException('Car category not found');
    return carCategory;
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  async store(@Body() carCategoryDto: CarCategoryDto): Promise<CarCategory> {
    return this.carCategoryService.insertCarCategory(carCategoryDto);
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
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

  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(':id(\\d+)')
  @HttpCode(204)
  async destroy(@Param('id') id: number): Promise<void> {
    const carCategory = await this.carCategoryService.getCarCategoryById(id);
    if (!carCategory) throw new NotFoundException('Car category not found');

    await this.carCategoryService.deleteCarCategory(id);
  }
}
