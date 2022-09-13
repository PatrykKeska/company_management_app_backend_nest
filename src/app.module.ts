import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlacesModule } from './places/places.module';
import { ProductsModule } from './products/products.module';
import { ProductInPlacesModule } from './product-in-places/product-in-places.module';
import dbConfig from './config/dbConfig';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig()),
    AuthModule,
    UserModule,
    PlacesModule,
    ProductsModule,
    ProductInPlacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
