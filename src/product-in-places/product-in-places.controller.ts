import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ProductInPlacesService } from './product-in-places.service';
import { AddProductToPlaceDto } from './dto/add-product-to-place.dto';
import { ProductAssignToPlaceResponse } from './interfaces/product-assign-to-place-response';

@Controller('product-in-places')
export class ProductInPlacesController {
  constructor(
    @Inject(ProductInPlacesService)
    private productInPlacesService: ProductInPlacesService,
  ) {}

  @Post('/assign')
  async assignProductToPlace(
    @Body() data: AddProductToPlaceDto,
  ): Promise<ProductAssignToPlaceResponse> {
    return this.productInPlacesService.addProductToPlace(data);
  }
}
