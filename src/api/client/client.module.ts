import { ClientController } from '@app/api/client/controllers/client.controller';
import { Client } from '@app/api/client/models/client.model';
import { ClientService } from '@app/api/client/services/client.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
