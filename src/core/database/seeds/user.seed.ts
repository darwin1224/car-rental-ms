import { User } from '@app/api/user/models/user.model';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class UserSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.manager.save(
      Object.assign(new User(), {
        name: 'Administrator',
        username: 'admin',
        password: '123456',
        role: 'admin',
      }),
    );
  }
}
