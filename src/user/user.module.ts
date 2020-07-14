import { UserController } from '@app/user/controllers/user.controller';
import { User } from '@app/user/models/user.model';
import { UserService } from '@app/user/services/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
