import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CarCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  displayName!: string;
}
