import { UserController } from '@app/modules/user/controllers/user.controller';
import { User } from '@app/modules/user/models/user.model';
import { UserService } from '@app/modules/user/services/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
