import { CarController } from '@app/modules/car/controllers/car.controller';
import { Car } from '@app/modules/car/models/car.model';
import { CarService } from '@app/modules/car/services/car.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
