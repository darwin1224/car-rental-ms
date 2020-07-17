import { User } from '@app/api/user/models/user.model';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(
    payload: Pick<User, 'name' | 'username' | 'role'>,
  ): Pick<User, 'name' | 'username' | 'role'> {
    return {
      name: payload.name,
      username: payload.username,
      role: payload.role,
    };
  }
}
