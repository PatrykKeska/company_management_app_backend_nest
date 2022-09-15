import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Products, ProductStatus } from '../entities/products.entity';
import { DataSource } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCreatedResponse } from './interfaces/product-created-response';
import { ProductUpdatedResponse } from './interfaces/product-updated-response';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductInPlaces } from '../entities/product_in_places.entity';
import { RemoveProductResponse } from './interfaces/remove-product-response';
import { FileTransferInterface } from '../file-transfer/interfaces/multer-disk-uploaded-files';
import { FileTransferService } from '../file-transfer/file-transfer.service';
import * as fs from 'fs';
import * as path from 'path';
import { storageDir } from '../utils/storage';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DataSource) private dataSource: DataSource,
    @Inject(forwardRef(() => FileTransferService))
    private fileTransferService: FileTransferService,
  ) {}

  async getAllAvailableProducts(): Promise<Products[]> {
    return await this.dataSource
      .getRepository(Products)
      .createQueryBuilder('products')
      .where('products.productStatus = :status ', { status: '1' })
      .getMany();
  }

  async createNewProduct(
    product: CreateProductDto,
    file: FileTransferInterface,
  ): Promise<ProductCreatedResponse> {
    const { name, price, dateOfBuy, amount } = product;
    const photo = file;
    if (!name || !price || !dateOfBuy || !amount) {
      return { isSuccess: false, message: 'All values are necessary!' };
    } else if (name.length < 3) {
      return {
        isSuccess: false,
        message: `${name} length have to be greater than 2`,
      };
    }
    try {
      const newProduct = new Products();
      newProduct.name = name;
      newProduct.price = Number(price);
      newProduct.amount = Number(amount);
      newProduct.dateOfBuy = dateOfBuy;
      if (photo) {
        newProduct.img = photo.filename;
      }
      await newProduct.save();
      return {
        isSuccess: true,
        message: `product ${name} successfully created!`,
      };
    } catch (e1) {
      try {
        if (photo) {
          fs.unlinkSync(photo.path);
        }
      } catch (e2) {
        throw e2;
      }
      throw e1;
    }
  }
  async getProductByID(id: string): Promise<Products> | null {
    const product = await Products.findOne({ where: { id } });
    if (product) {
      return product;
    } else return null;
  }
  //@TODO CHeck if you not put a file still can upadte and everything is ok
  async updateProduct(
    product: UpdateProductDto,
    file: FileTransferInterface,
  ): Promise<ProductUpdatedResponse> {
    const { id, name, price, amount, dateOfBuy } = product;
    const photo = file;
    const productToUpdate = await Products.findOne({ where: { id } });

    if (productToUpdate) {
      if (name.length > 2) {
        productToUpdate.name = name;
        productToUpdate.price = Number(price);
        productToUpdate.dateOfBuy = dateOfBuy;
        productToUpdate.amount = Number(amount);
        if (photo) {
          const pathTo = path.join(
            storageDir(),
            `/product-photos/${productToUpdate.img}`,
          );
          console.log(pathTo);
          fs.unlinkSync(pathTo);
          productToUpdate.img = photo.filename;
        }
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
  //@TODO CREATE A REMOVING OLD FILES !
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
