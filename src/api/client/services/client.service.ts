import { ClientDto } from '@app/api/client/dtos/client.dto';
import { Client } from '@app/api/client/models/client.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  getClients(
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<Client>> {
    return paginate(this.clientRepository, paginationOptions);
  }

  getClientById(id: string): Promise<Client | undefined> {
    return this.clientRepository.findOne(id);
  }

  insertClient(clientDto: ClientDto): Promise<Client> {
    return this.clientRepository.save(clientDto);
  }

  updateClient(id: string, clientDto: ClientDto): Promise<UpdateResult> {
    return this.clientRepository.update(id, clientDto);
  }

  deleteClient(id: string): Promise<DeleteResult> {
    return this.clientRepository.delete(id);
  }
}
