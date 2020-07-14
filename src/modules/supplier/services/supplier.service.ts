import { SupplierDto } from '@app/modules/supplier/dtos/supplier.dto';
import { Supplier } from '@app/modules/supplier/models/supplier.model';
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

  getSupplierById(id: number): Promise<Supplier | undefined> {
    return this.supplierRepository.findOne(id);
  }

  insertSupplier(supplierDto: SupplierDto): Promise<Supplier> {
    return this.supplierRepository.save(supplierDto);
  }

  updateSupplier(id: number, supplierDto: SupplierDto): Promise<UpdateResult> {
    return this.supplierRepository.update(id, supplierDto);
  }

  deleteSupplier(id: number): Promise<DeleteResult> {
    return this.supplierRepository.delete(id);
  }
}
