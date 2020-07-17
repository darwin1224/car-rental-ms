import { CarDto } from '@app/api/car/dtos/car.dto';
import { Car } from '@app/api/car/models/car.model';
import { CarService } from '@app/api/car/services/car.service';
import { Roles } from '@app/common/decorators/roles.decorator';
import { AuthenticateGuard } from '@app/common/guards/authenticate.guard';
import { AuthorizeGuard } from '@app/common/guards/authorize.guard';
import { uuidRegex } from '@app/common/utils/uuid-regex.util';
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
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('car')
@ApiBearerAuth()
@Controller('cars')
@UseGuards(AuthenticateGuard, AuthorizeGuard)
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly configService: ConfigService,
  ) {}

  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  @Roles('admin')
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Car>> {
    return this.carService.getCars({
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/cars`,
    });
  }

  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(`:id(${uuidRegex})`)
  @Roles('admin')
  async show(@Param('id') id: string): Promise<Car> {
    const car = await this.carService.getCarByIdWithRelationship(id);
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  @Roles('admin')
  async store(@Body() carDto: CarDto): Promise<Car> {
    return this.carService.insertCar(carDto);
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(`:id(${uuidRegex})`)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() carDto: CarDto,
  ): Promise<Car & CarDto> {
    const car = await this.carService.getCarById(id);
    if (!car) throw new NotFoundException('Car not found');

    await this.carService.updateCar(id, carDto);

    return { ...car, ...carDto };
  }

  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(`:id(${uuidRegex})`)
  @Roles('admin')
  @HttpCode(204)
  async destroy(@Param('id') id: string): Promise<void> {
    const car = await this.carService.getCarById(id);
    if (!car) throw new NotFoundException('Car not found');

    await this.carService.deleteCar(id);
  }
}
