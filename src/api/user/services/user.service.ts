import { UserDto } from '@app/api/user/dtos/user.dto';
import { User } from '@app/api/user/models/user.model';
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

  getUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  getUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }

  insertUser(userDto: UserDto): Promise<User> {
    return this.userRepository.save(Object.assign(new User(), { ...userDto }));
  }

  updateUser(id: string, userDto: UserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, userDto);
  }

  deleteUser(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
