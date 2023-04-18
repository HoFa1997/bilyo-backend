import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ACCESS_TOKEN_SECRET_KEY } from './shared/utils/constant';
import * as express from 'express';

async function bootstrap() {
  const port = process.env.PORT || 8000; // default to port 8000 if not specified in environment variable
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: 'Access-Control-Allow-Credentials',
  });
  app.use(cookieParser(ACCESS_TOKEN_SECRET_KEY));

  app.use(express.static('packages/backend/public'));
  await app.listen(port);
}

bootstrap();
