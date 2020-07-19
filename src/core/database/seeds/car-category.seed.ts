import { CarCategory } from '@app/api/car-category/models/car-category.model';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CarCategorySeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(CarCategory)().createMany(10);
  }
}
