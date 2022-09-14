import { forwardRef, Module } from '@nestjs/common';
import { ProductInPlacesService } from './product-in-places.service';
import { ProductInPlacesController } from './product-in-places.controller';
import { PlacesModule } from '../places/places.module';
import { ProductsModule } from '../products/products.module';

@Module({
  providers: [ProductInPlacesService],
  controllers: [ProductInPlacesController],
  imports: [forwardRef(() => PlacesModule), forwardRef(() => ProductsModule)],
})
export class ProductInPlacesModule {}
