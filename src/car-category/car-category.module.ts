import { CarCategory } from '@app/car-category/models/car-category';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarCategoryController } from './controllers/car-category.controller';
import { CarCategoryService } from './services/car-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarCategory])],
  controllers: [CarCategoryController],
  providers: [CarCategoryService],
})
export class CarCategoryModule {}