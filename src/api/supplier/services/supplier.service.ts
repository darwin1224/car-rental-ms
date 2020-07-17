import { SupplierDto } from '@app/api/supplier/dtos/supplier.dto';
import { Supplier } from '@app/api/supplier/models/supplier.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  getSuppliers(
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<Supplier>> {
    return paginate(this.supplierRepository, paginationOptions);
  }

  getSupplierById(id: string): Promise<Supplier | undefined> {
    return this.supplierRepository.findOne(id);
  }

  insertSupplier(supplierDto: SupplierDto): Promise<Supplier> {
    return this.supplierRepository.save(supplierDto);
  }

  updateSupplier(id: string, supplierDto: SupplierDto): Promise<UpdateResult> {
    return this.supplierRepository.update(id, supplierDto);
  }

  deleteSupplier(id: string): Promise<DeleteResult> {
    return this.supplierRepository.delete(id);
  }
}
