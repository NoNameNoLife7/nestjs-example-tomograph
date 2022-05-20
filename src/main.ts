import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { HttpExceptionFilter } from './common/utils/';

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    validationError: { target: true, value: true },
  });
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3003);
}
bootstrap();
