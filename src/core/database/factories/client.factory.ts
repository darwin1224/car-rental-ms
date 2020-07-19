import { Client } from '@app/api/client/models/client.model';
import { define } from 'typeorm-seeding';

define(Client, (faker, context) => {
  const client = new Client();
  client.name = faker.name.firstName();
  client.phoneNumber = faker.phone.phoneNumber();
  client.address = faker.address.country();
  return client;
});
