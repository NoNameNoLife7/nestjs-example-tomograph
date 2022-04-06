import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {RolesModule} from "./roles/roles.module";
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [RolesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
