import { AuthModule } from '@app/api/auth/auth.module';
import { CarCategoryModule } from '@app/api/car-category/car-category.module';
import { CarModule } from '@app/api/car/car.module';
import { SupplierModule } from '@app/api/supplier/supplier.module';
import { UserModule } from '@app/api/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    SupplierModule,
    CarCategoryModule,
    UserModule,
    AuthModule,
    CarModule,
  ],
})
export class ApiModule {}
