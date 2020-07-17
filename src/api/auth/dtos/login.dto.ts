import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password!: string;
}
