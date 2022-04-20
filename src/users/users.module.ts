import { Module } from '@nestjs/common';
import { UserService, RoleService } from './services/users.service';
import { UserController, RoleController } from './controller/users.controller';

@Module({
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
})
export class UsersModule {}
