import { ClientDto } from '@app/api/client/dtos/client.dto';
import { Client } from '@app/api/client/models/client.model';
import { ClientService } from '@app/api/client/services/client.service';
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

@ApiTags('client')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(AuthenticateGuard, AuthorizeGuard)
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
  ) {}

  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  @Roles('admin')
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Client>> {
    return this.clientService.getClients({
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/clients`,
    });
  }

  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(`:id(${uuidRegex})`)
  @Roles('admin')
  async show(@Param('id') id: string): Promise<Client> {
    const client = await this.clientService.getClientById(id);
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  @Roles('admin')
  async store(@Body() clientDto: ClientDto): Promise<Client> {
    return this.clientService.insertClient(clientDto);
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(`:id(${uuidRegex})`)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() clientDto: ClientDto,
  ): Promise<Client> {
    const client = await this.clientService.getClientById(id);
    if (!client) throw new NotFoundException('Client not found');

    await this.clientService.updateClient(id, clientDto);

    return { ...client, ...clientDto };
  }

  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(`:id(${uuidRegex})`)
  @Roles('admin')
  @HttpCode(204)
  async destroy(@Param('id') id: string): Promise<void> {
    const client = await this.clientService.getClientById(id);
    if (!client) throw new NotFoundException('Client not found');

    await this.clientService.deleteClient(id);
  }
}
