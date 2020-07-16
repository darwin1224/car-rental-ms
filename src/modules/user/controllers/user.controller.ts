import { Roles } from '@app/decorators/roles.decorator';
import { AuthenticateGuard } from '@app/guards/authenticate.guard';
import { AuthorizeGuard } from '@app/guards/authorize.guard';
import { UserDto } from '@app/modules/user/dtos/user.dto';
import { User } from '@app/modules/user/models/user.model';
import { UserService } from '@app/modules/user/services/user.service';
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

@ApiTags('user')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthenticateGuard, AuthorizeGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  @Roles('admin')
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<User>> {
    return this.userService.getUsers({
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/users`,
    });
  }

  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(':id(\\d+)')
  @Roles('admin')
  async show(@Param('id') id: number): Promise<User> {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  @Roles('admin')
  async store(@Body() userDto: UserDto): Promise<User> {
    return this.userService.insertUser(userDto);
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(':id(\\d+)')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() userDto: UserDto,
  ): Promise<User> {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.userService.updateUser(id, userDto);

    return { ...user, ...userDto } as User;
  }

  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(':id(\\d+)')
  @Roles('admin')
  @HttpCode(204)
  async destroy(@Param('id') id: number): Promise<void> {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.userService.deleteUser(id);
  }
}
