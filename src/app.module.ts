import { CarCategoryModule } from '@app/car-category/car-category.module';
import { CarCategory } from '@app/car-category/models/car-category.model';
import { Supplier } from '@app/supplier/models/supplier.model';
import { SupplierModule } from '@app/supplier/supplier.module';
import { User } from '@app/user/models/user.model';
import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Supplier, CarCategory, User],
        synchronize: true,
        logging: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
    SupplierModule,
    CarCategoryModule,
    UserModule,
  ],
})
export class AppModule {}
