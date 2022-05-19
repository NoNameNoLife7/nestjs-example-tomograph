import { Module } from '@nestjs/common';
import { ProxyServerController } from './controllers/proxy.server.controller';

@Module({
  controllers: [ProxyServerController],
})
export class ProxyServerModule {}
