import { Module } from '@nestjs/common';
import { ProductInPlacesService } from './product-in-places.service';
import { ProductInPlacesController } from './product-in-places.controller';

@Module({
  providers: [ProductInPlacesService],
  controllers: [ProductInPlacesController]
})
export class ProductInPlacesModule {}
