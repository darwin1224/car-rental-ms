import { Client } from '@app/api/client/models/client.model';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class ClientSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Client)().createMany(50);
  }
}
