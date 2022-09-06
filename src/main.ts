import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      ...(process.env.NODE_ENV == 'production' && {
        disableErrorMessages: true,
      }),
    }),
  );
  app.enableCors();
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
