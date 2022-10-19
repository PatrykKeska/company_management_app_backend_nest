import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NotFoundExceptionFilter } from './filters/NotFoundExceptionFilter.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });

  app.use(cookieParser());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  await app.listen(3001);
}
bootstrap();
