import { Car } from '@app/modules/car/models/car.model';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CarDto implements Partial<Car> {
  @IsNotEmpty()
  @IsUUID('all')
  carCategory!: string;

  @IsNotEmpty()
  @IsUUID('all')
  supplier!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
