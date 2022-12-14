import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductInPlacesService } from './product-in-places.service';
import { AddProductToPlaceDto } from './dto/add-product-to-place.dto';
import { ProductAssignToPlaceResponse } from './interfaces/product-assign-to-place-response';
import { AuthGuard } from '@nestjs/passport';
import { RemoveProductAssignDto } from './dto/remove-product-assign.dto';
import { RemoveProductAssignResponse } from './interfaces/remove-product-assign-response';
import { AllProductsInPlace } from './interfaces/all-products-in-place';
import { Places } from '../entities/places.entity';

@Controller('product-in-places')
export class ProductInPlacesController {
  constructor(
    @Inject(ProductInPlacesService)
    private productInPlacesService: ProductInPlacesService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('/assign')
  async assignProductToPlace(
    @Body() data: AddProductToPlaceDto,
  ): Promise<ProductAssignToPlaceResponse> {
    return this.productInPlacesService.addProductToPlace(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove')
  async removeProduct(
    @Body() data: RemoveProductAssignDto,
  ): Promise<RemoveProductAssignResponse> {
    return this.productInPlacesService.removeProductFromPlace(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update')
  async updateAmountOfProduct(
    @Body() data: AddProductToPlaceDto,
  ): Promise<ProductAssignToPlaceResponse> {
    return this.productInPlacesService.subtractAmountOfProducts(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/get-exact')
  async getExactPlace(
    @Body() data: AddProductToPlaceDto,
  ): Promise<AllProductsInPlace> {
    const { placeId } = data;
    return this.productInPlacesService.getExactFinalizedLocation(placeId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/get-all')
  async getAllProductsInPlaces(): Promise<Places[]> {
    return await this.productInPlacesService.getAllAssignedLocations();
  }
}
