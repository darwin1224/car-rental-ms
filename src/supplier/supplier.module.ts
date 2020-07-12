import { SupplierController } from '@app/supplier/controllers/supplier.controller';
import { Supplier } from '@app/supplier/models/supplier';
import { SupplierService } from '@app/supplier/services/supplier.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
