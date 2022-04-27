import { Module } from '@nestjs/common';
import { UserService, RoleService } from './services';
import { UserController, RoleController } from './controllers';

@Module({
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
})
export class UserModule {}
