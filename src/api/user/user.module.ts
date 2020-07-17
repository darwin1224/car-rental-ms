import { UserController } from '@app/api/user/controllers/user.controller';
import { User } from '@app/api/user/models/user.model';
import { UserService } from '@app/api/user/services/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
