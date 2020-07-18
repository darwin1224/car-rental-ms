import { ClientController } from '@app/api/client/controllers/client.controller';
import { ClientService } from '@app/api/client/services/client.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
