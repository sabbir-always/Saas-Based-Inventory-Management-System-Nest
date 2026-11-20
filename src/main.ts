import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { instrument: ObserveInstrument });
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
