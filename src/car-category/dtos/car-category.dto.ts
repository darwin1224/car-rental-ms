import { CarCategory } from '@app/car-category/models/car-category';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CarCategoryDto implements Partial<CarCategory> {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  displayName!: string;
}
