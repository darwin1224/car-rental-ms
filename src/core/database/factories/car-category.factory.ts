import { CarCategory } from '@app/api/car-category/models/car-category.model';
import { define } from 'typeorm-seeding';

define(CarCategory, (faker, context) => {
  const carCategory = new CarCategory();
  carCategory.name = faker.lorem.word();
  carCategory.displayName = faker.random.words(2);
  return carCategory;
});
