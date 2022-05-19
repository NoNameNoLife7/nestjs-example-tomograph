import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { LogEventComModule } from './modules/log-event-com/log-event-com.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { WebsocketModule } from './modules/web-socket/websocket.module';
import { ProxyServerModule } from './modules/proxy-config-server/proxy.server.module';

@Module({
  imports: [
    WebsocketModule,
    PrismaModule,
    UserModule,
    PatientModule,
    LogEventComModule,
    ConfigurationModule,
    ProxyServerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
