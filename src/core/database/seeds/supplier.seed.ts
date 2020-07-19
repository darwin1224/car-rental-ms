import { Supplier } from '@app/api/supplier/models/supplier.model';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class SupplierSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Supplier)().createMany(50);
  }
}
