import { Inject, Injectable } from '@nestjs/common';
import { Products, ProductStatus } from '../entities/products.entity';
import { DataSource } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCreatedResponse } from './interfaces/product-created-response';
import { GetSingleProductResponse } from './interfaces/get-single-product-response';
import { ProductUpdatedResponse } from './interfaces/product-updated-response';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductInPlaces } from '../entities/product_in_places.entity';
import { RemoveProductResponse } from './interfaces/remove-product-response';

@Injectable()
export class ProductsService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}

  async getAllAvailableProducts(): Promise<Products[]> {
    return await this.dataSource
      .getRepository(Products)
      .createQueryBuilder('products')
      .where('products.productStatus = :status ', { status: '1 ' })
      .getMany();
  }

  async createNewProduct(
    product: CreateProductDto,
  ): Promise<ProductCreatedResponse> {
    const { name, img, price, dateOfBuy, amount } = product;
    if (!name || !img || !price || !dateOfBuy || !amount) {
      return { isSuccess: false, message: 'All values are necessary!' };
    } else if (name.length < 3) {
      return {
        isSuccess: false,
        message: `${name} length have to be greater than 2`,
      };
    } else {
      const newProduct = new Products();
      newProduct.name = name;
      newProduct.price = price;
      newProduct.amount = amount;
      newProduct.dateOfBuy = dateOfBuy;
      newProduct.img = img;
      await newProduct.save();
      return {
        isSuccess: true,
        message: `product ${name} successfully created!`,
      };
    }
  }

  async getProductByID(id: string): Promise<GetSingleProductResponse> | null {
    const product = Products.findOne({ where: { id } });
    if (product) {
      return product;
    } else return null;
  }

  async updateProduct(
    product: UpdateProductDto,
  ): Promise<ProductUpdatedResponse> {
    const { id, name, price, amount, dateOfBuy, img } = product;
    const productToUpdate = await Products.findOne({ where: { id } });
    if (productToUpdate) {
      if (name.length > 2) {
        productToUpdate.name = name;
        productToUpdate.price = price;
        productToUpdate.dateOfBuy = dateOfBuy;
        productToUpdate.amount = amount;
        productToUpdate.img = img;
        await productToUpdate.save();
        return {
          isSuccess: true,
          message: `product ${name} updated!`,
        };
      } else {
        return {
          isSuccess: false,
          message: 'name length have to be longer than 2 characters',
        };
      }
    } else {
      return {
        isSuccess: false,
        message: 'There is no such a product!',
      };
    }
  }

  async removeProduct(id: string): Promise<RemoveProductResponse> {
    const isProductExist = await Products.findOne({ where: { id } });
    const isProductAssign = await this.dataSource
      .getRepository(ProductInPlaces)
      .createQueryBuilder('productInPlaces')
      .leftJoinAndSelect('productInPlaces.products', 'products')
      .where('products.id = :id', { id })
      .getOne();
    if (!isProductExist) {
      return {
        isSuccess: false,
        message: 'there is no such a product',
      };
    }
    if (!isProductAssign && isProductExist) {
      await Products.delete(id);
      return {
        isSuccess: true,
        message: 'product has been removed',
      };
    } else if (isProductExist) {
      isProductExist.productStatus = ProductStatus.OUTOFSTOCK;
      await isProductExist.save();
      return {
        isSuccess: false,
        message: 'product is marked as Out of stock',
      };
    }
  }
}
