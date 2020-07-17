import { SupplierDto } from '@app/api/supplier/dtos/supplier.dto';
import { Supplier } from '@app/api/supplier/models/supplier.model';
import { SupplierService } from '@app/api/supplier/services/supplier.service';
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

@ApiTags('supplier')
@ApiBearerAuth()
@Controller('suppliers')
@UseGuards(AuthenticateGuard, AuthorizeGuard)
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly configService: ConfigService,
  ) {}

  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  @Roles('admin')
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
  @Get(`:id(${uuidRegex})`)
  @Roles('admin')
  async show(@Param('id') id: string): Promise<Supplier> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  @Roles('admin')
  async store(@Body() supplierDto: SupplierDto): Promise<Supplier> {
    return this.supplierService.insertSupplier(supplierDto);
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(`:id(${uuidRegex})`)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() supplierDto: SupplierDto,
  ): Promise<Supplier> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.supplierService.updateSupplier(id, supplierDto);

    return { ...supplier, ...supplierDto };
  }

  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(`:id(${uuidRegex})`)
  @Roles('admin')
  @HttpCode(204)
  async destroy(@Param('id') id: string): Promise<void> {
    const supplier = await this.supplierService.getSupplierById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.supplierService.deleteSupplier(id);
  }
}
