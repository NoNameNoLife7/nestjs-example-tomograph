import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { LogEventComModule } from './modules/log-event-com/log-event-com.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { WebSockeMo } from './modules/web-socket/web-socket.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PatientModule,
    LogEventComModule,
    ConfigurationModule,
    WebSockeMo,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
