import { CarCategory } from '@app/api/car-category/models/car-category.model';
import { Car } from '@app/api/car/models/car.model';
import { Client } from '@app/api/client/models/client.model';
import { Supplier } from '@app/api/supplier/models/supplier.model';
import { User } from '@app/api/user/models/user.model';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Supplier, CarCategory, User, Car, Client],
        synchronize: true,
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
  ],
})
export class DatabaseModule {}
