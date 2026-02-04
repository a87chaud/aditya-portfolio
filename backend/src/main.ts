import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    'https://main.db7gvbde751z2.amplifyapp.com',
    'https://www.aditya-chaudhary.com',
    'https://aditya-chaudhary.com',
    'http://localhost:4200',
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ? process.env.PORT : 3000;
  await app.listen(port);
}
bootstrap();
