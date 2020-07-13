import { Supplier } from '@app/supplier/models/supplier.model';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class SupplierDto implements Partial<Supplier> {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
