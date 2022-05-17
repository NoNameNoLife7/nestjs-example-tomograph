import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

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
  await app.listen(3003);
}
bootstrap();
