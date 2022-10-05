import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: 'kendziior4.usermd.net',
  });
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
