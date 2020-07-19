import { Supplier } from '@app/api/supplier/models/supplier.model';
import { define } from 'typeorm-seeding';

define(Supplier, (faker, context) => {
  const supplier = new Supplier();
  supplier.name = faker.name.firstName();
  supplier.phoneNumber = faker.phone.phoneNumber();
  supplier.address = faker.address.country();
  return supplier;
});
