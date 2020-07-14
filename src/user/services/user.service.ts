import { UserDto } from '@app/user/dtos/user.dto';
import { User } from '@app/user/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getUsers(paginationOptions: IPaginationOptions): Promise<Pagination<User>> {
    return paginate(this.userRepository, paginationOptions);
  }

  getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  insertUser(userDto: UserDto): Promise<User> {
    return this.userRepository.save(Object.assign(new User(), { ...userDto }));
  }

  updateUser(id: number, userDto: UserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, userDto);
  }

  deleteUser(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
