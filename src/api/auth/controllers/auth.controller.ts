import { LoginDto } from '@app/api/auth/dtos/login.dto';
import { UserService } from '@app/api/user/services/user.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import bcrypt from 'bcryptjs';

export interface JwtResponse {
  accessToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized exception response.' })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<JwtResponse> {
    const user = await this.userService.getUserByUsername(loginDto.username);

    if (!user || !bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Authentication failed');
    }

    return {
      accessToken: this.jwtService.sign({
        name: user.name,
        username: user.username,
        role: user.role,
      }),
    };
  }
}
