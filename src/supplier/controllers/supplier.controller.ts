import { SupplierDto } from '@app/supplier/dtos/supplier.dto';
import { Supplier } from '@app/supplier/models/supplier';
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
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('suppliers')
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly configService: ConfigService,
  ) {}

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

  @Get(':id(\\d+)')
  async show(@Param('id') id: number): Promise<Supplier> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  @Post()
  async store(@Body() supplierDto: SupplierDto): Promise<Supplier> {
    return this.supplierService.insertSupplier(supplierDto);
  }

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

  @Delete(':id(\\d+)')
  @HttpCode(204)
  async destroy(@Param('id') id: number): Promise<void> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.supplierService.deleteSupplier(id);
  }
}
