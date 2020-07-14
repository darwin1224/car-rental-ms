import { User } from '@app/user/models/user.model';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UserDto implements Partial<User> {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password!: string;

  @IsNotEmpty()
  @IsEnum(['admin', 'cashier'])
  role!: string;
}
