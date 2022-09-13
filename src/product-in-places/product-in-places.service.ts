import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AddProductToPlaceDto } from './dto/add-product-to-place.dto';
import { ProductAssignToPlaceResponse } from './interfaces/product-assign-to-place-response';
import { ProductInPlaces } from '../entities/product_in_places.entity';
import { DataSource } from 'typeorm';
import { PlacesService } from '../places/places.service';
import { ProductsService } from '../products/products.service';
import { ProductStatus } from '../entities/products.entity';
import { PlaceStatus } from '../entities/places.entity';
import { NotAvailableException } from '../exceptions/not-available.exception';
import { NeedAllValuesException } from '../exceptions/need-all-values.exception';
import { PlaceProductNotExistException } from '../exceptions/place-product-not-exist.exception';
import { ProductAmountToLow } from '../exceptions/product-amount-to.low';

@Injectable()
export class ProductInPlacesService {
  constructor(
    @Inject(DataSource) private dataSource: DataSource,
    @Inject(forwardRef(() => PlacesService))
    private placesService: PlacesService,
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
  ) {}
  async addProductToPlace(
    data: AddProductToPlaceDto,
  ): Promise<ProductAssignToPlaceResponse> {
    const { productId, placeId, amount } = data;
    const placeToAssign = await this.placesService.getPlaceByID(placeId);
    const productToAssign = await this.productService.getProductByID(productId);
    const productAlreadyExistInPlace = await this.dataSource
      .getRepository(ProductInPlaces)
      .createQueryBuilder('productInPlaces')
      .leftJoinAndSelect('productInPlaces.places', 'places')
      .leftJoinAndSelect('productInPlaces.products', 'products')
      .where('places.id = :placeId', { placeId })
      .andWhere('products.id = :productId', { productId })
      .getOne();

    if (!productId || !placeId || !amount) {
      throw new NeedAllValuesException();
    }
    if (!placeToAssign || !productToAssign) {
      throw new PlaceProductNotExistException();
    }
    if (productToAssign.productStatus === ProductStatus.OUTOFSTOCK) {
      throw new NotAvailableException();
    }
    if (placeToAssign.placeStatus === PlaceStatus.NOTAVAILABLE) {
      throw new NotAvailableException();
    }
    if (productToAssign.amount < amount) {
      throw new ProductAmountToLow();
    }
    if (productAlreadyExistInPlace) {
      productAlreadyExistInPlace.amount += amount;
      productToAssign.amount -= amount;
      await productAlreadyExistInPlace.save();
      if (productToAssign.amount === 0) {
        productToAssign.productStatus = ProductStatus.OUTOFSTOCK;
      }
      await productToAssign.save();
      return {
        isSuccess: true,
        message:
          'This product already exist in this place, so amount was updated!',
      };
    }

    const newAssign = new ProductInPlaces();
    productToAssign.amount -= amount;
    newAssign.products = productToAssign;
    newAssign.places = placeToAssign;
    newAssign.amount = amount;
    await newAssign.save();
    await productToAssign.save();
    if (productToAssign.amount === 0) {
      productToAssign.productStatus = ProductStatus.OUTOFSTOCK;
    }
    return { isSuccess: true, message: `Product assign successfully` };
  }
}
