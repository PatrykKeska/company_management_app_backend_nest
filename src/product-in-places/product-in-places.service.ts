import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AddProductToPlaceDto } from './dto/add-product-to-place.dto';
import { ProductAssignToPlaceResponse } from './interfaces/product-assign-to-place-response';
import { ProductInPlaces } from '../entities/product_in_places.entity';
import { DataSource } from 'typeorm';
import { PlacesService } from '../places/places.service';
import { ProductsService } from '../products/products.service';
import { Products, ProductStatus } from '../entities/products.entity';
import { Places, PlaceStatus } from '../entities/places.entity';
import { NotAvailableException } from '../exceptions/not-available.exception';
import { NeedAllValuesException } from '../exceptions/need-all-values.exception';
import { PlaceProductNotExistException } from '../exceptions/place-product-not-exist.exception';
import { ProductAmountToLow } from '../exceptions/product-amount-to.low';
import { RemoveProductAssignDto } from './dto/remove-product-assign.dto';
import { RemoveProductAssignResponse } from './interfaces/remove-product-assign-response';
import { AllProductsInPlace } from './interfaces/all-products-in-place';

@Injectable()
export class ProductInPlacesService {
  constructor(
    @Inject(DataSource) private dataSource: DataSource,
    @Inject(forwardRef(() => PlacesService))
    private placesService: PlacesService,
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
  ) {}

  async getAllAssignedLocations(): Promise<Places[]> {
    const allFinalPlaces = [];
    const response = await ProductInPlaces.find({
      relations: ['places'],
    });
    const data = response.filter(
      (value, index, self) =>
        index ===
        self.findIndex((record) => record.places.id === value.places.id),
    );
    data.map((place) => {
      const ourData = {
        id: place.places.id,
        name: place.places.name,
        city: place.places.city,
        img: place.places.img,
        street: place.places.street,
        buildNumber: place.places.buildNumber,
      };
      allFinalPlaces.push(ourData);
    });

    return allFinalPlaces;
  }

  async addProductToPlace(
    data: AddProductToPlaceDto,
  ): Promise<ProductAssignToPlaceResponse> {
    const { productId, placeId, amount } = data;
    const placeToAssign = await this.placesService.getPlaceByID(placeId);
    const productToAssign = await this.productService.getProductByID(productId);
    const productAlreadyExistInPlace = await this.getAssignedProductToPlace(
      placeId,
      productId,
    );

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
          'This product already exists in this place. The amount of product was updated instead of added!',
      };
    }

    const newAssign = new ProductInPlaces();
    productToAssign.amount -= amount;
    newAssign.products = productToAssign;
    newAssign.places = placeToAssign;
    newAssign.amount = amount;
    if (productToAssign.amount === 0) {
      productToAssign.productStatus = ProductStatus.OUTOFSTOCK;
    }
    await newAssign.save();
    await productToAssign.save();
    return { isSuccess: true, message: `Product assign successfully` };
  }

  async removeProductFromPlace(
    data: RemoveProductAssignDto,
  ): Promise<RemoveProductAssignResponse> {
    const { placeId, productId } = data;

    await this.validateIsObjectsExist(productId, placeId);

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductInPlaces)
      .where('products.id = :productId', { productId })
      .andWhere('places.id = :placeId', { placeId })
      .execute();

    const stock = await this.getExactFinalizedLocation(placeId);
    if (stock.products.length < 1) {
      return {
        isSuccess: true,
        message:
          'Successfully product was removed. There are no more products in this place.',
        redirect: true,
      };
    }
    return {
      isSuccess: true,
      message: 'Successfully product removed',
      redirect: false,
    };
  }

  async subtractAmountOfProducts(
    data: AddProductToPlaceDto,
  ): Promise<ProductAssignToPlaceResponse> {
    const { productId, placeId, amount: amountToRemove } = data;
    const assignedProductToPlace = await this.getAssignedProductToPlace(
      placeId,
      productId,
    );
    await this.validateIsObjectsExist(productId, placeId);
    if (
      assignedProductToPlace.amount < amountToRemove ||
      amountToRemove === 0
    ) {
      throw new ProductAmountToLow();
    }
    await this.dataSource
      .createQueryBuilder()
      .update(ProductInPlaces)
      .set({ amount: assignedProductToPlace.amount - amountToRemove })
      .where('products.id = :productId', { productId })
      .andWhere('places.id = :placeId', { placeId })
      .execute();
    const isOutOfStock = await this.getAssignedProductToPlace(
      placeId,
      productId,
    );
    if (isOutOfStock.amount === 0) {
      await this.removeProductFromPlace({ placeId, productId });
      const stock = await this.getExactFinalizedLocation(placeId);
      if (stock.products.length === 0) {
        return {
          isSuccess: true,
          message:
            'Successfully product was removed. There are no more products in this place.',
          redirect: true,
        };
      } else {
        return {
          isSuccess: true,
          message: `${amountToRemove} pieces amount of product was subtracted and deleted completely`,
          redirect: false,
        };
      }
    } else {
      return {
        isSuccess: true,
        message: `${amountToRemove} pieces amount of product was subtracted`,
        redirect: false,
      };
    }
  }

  async getAssignedProductToPlace(placeId, productId) {
    if (!placeId || !productId) {
      throw new NeedAllValuesException();
    }
    return await this.dataSource
      .getRepository(ProductInPlaces)
      .createQueryBuilder('productInPlaces')
      .leftJoinAndSelect('productInPlaces.places', 'places')
      .leftJoinAndSelect('productInPlaces.products', 'products')
      .where('places.id = :placeId', { placeId })
      .andWhere('products.id = :productId', { productId })
      .getOne();
  }

  async getExactFinalizedLocation(
    placeId: string,
  ): Promise<AllProductsInPlace> {
    if (!placeId) {
      throw new NeedAllValuesException();
    }
    const allProductsInPlace = {
      place: {},
      products: [],
    } as AllProductsInPlace;

    const products = await this.dataSource
      .getRepository(ProductInPlaces)
      .createQueryBuilder('productInPlaces')
      .leftJoinAndSelect('productInPlaces.places', 'places')
      .innerJoinAndSelect('productInPlaces.products', 'products')
      .where('places.id = :placeId', { placeId })
      .getMany();
    if (!products) {
      throw new PlaceProductNotExistException();
    }
    products.map((res) => {
      allProductsInPlace.place = { ...res.places };
      const finalProduct = {
        id: '',
        name: '',
        img: '',
        price: 0,
        dateOfBuy: '',
        amount: 0,
      } as Products;
      finalProduct.id = res.products.id;
      finalProduct.name = res.products.name;
      finalProduct.img = res.products.img;
      finalProduct.price = res.products.price;
      finalProduct.dateOfBuy = res.products.dateOfBuy;
      finalProduct.amount = res.amount;
      allProductsInPlace.products.push(finalProduct);
    });
    return allProductsInPlace;
  }

  async validateIsObjectsExist(productId, placeId) {
    const isPlaceExist = await this.placesService.getPlaceByID(placeId);
    const isProductExist = await this.productService.getProductByID(productId);
    if (!productId || !placeId) {
      throw new NeedAllValuesException();
    }
    if (!isPlaceExist || !isProductExist) {
      throw new PlaceProductNotExistException();
    }
    if (!(await this.getAssignedProductToPlace(placeId, productId))) {
      throw new PlaceProductNotExistException();
    }
    return true;
  }
}
