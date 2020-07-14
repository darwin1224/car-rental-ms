import { User } from '@app/modules/user/models/user.model';
import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class LoginDto implements Partial<User> {
  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password!: string;
}
