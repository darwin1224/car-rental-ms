import { SupplierDto } from '@app/supplier/dtos/supplier.dto';
import { Supplier } from '@app/supplier/models/supplier.model';
import { SupplierService } from '@app/supplier/services/supplier.service';
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

@ApiTags('supplier')
@Controller('suppliers')
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly configService: ConfigService,
  ) {}

  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Supplier>> {
    return this.supplierService.getSuppliers({
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/suppliers`,
    });
  }

  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(':id(\\d+)')
  async show(@Param('id') id: number): Promise<Supplier> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  async store(@Body() supplierDto: SupplierDto): Promise<Supplier> {
    return this.supplierService.insertSupplier(supplierDto);
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(':id(\\d+)')
  async update(
    @Param('id') id: number,
    @Body() supplierDto: SupplierDto,
  ): Promise<Supplier> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.supplierService.updateSupplier(id, supplierDto);

    return { ...supplier, ...supplierDto };
  }

  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(':id(\\d+)')
  @HttpCode(204)
  async destroy(@Param('id') id: number): Promise<void> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.supplierService.deleteSupplier(id);
  }
}
