import { SupplierController } from '@app/modules/supplier/controllers/supplier.controller';
import { Supplier } from '@app/modules/supplier/models/supplier.model';
import { SupplierService } from '@app/modules/supplier/services/supplier.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
