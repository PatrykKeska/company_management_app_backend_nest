import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlacesModule } from './places/places.module';
import { ProductsModule } from './products/products.module';
import { ProductInPlacesModule } from './product-in-places/product-in-places.module';
import { FileTransferModule } from './file-transfer/file-transfer.module';
import dbConfig from './config/dbConfig';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig()),
    AuthModule,
    UserModule,
    PlacesModule,
    ProductsModule,
    ProductInPlacesModule,
    FileTransferModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public/product-photos/'),
      serveRoot: '/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude('/api/**')
      .forRoutes({ path: '/places', method: RequestMethod.ALL });
  }
}
