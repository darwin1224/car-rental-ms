import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CarDto {
  @IsNotEmpty()
  @IsUUID()
  carCategoryId!: string;

  @IsNotEmpty()
  @IsUUID()
  supplierId!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
