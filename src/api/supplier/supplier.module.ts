import { SupplierController } from '@app/api/supplier/controllers/supplier.controller';
import { Supplier } from '@app/api/supplier/models/supplier.model';
import { SupplierService } from '@app/api/supplier/services/supplier.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
