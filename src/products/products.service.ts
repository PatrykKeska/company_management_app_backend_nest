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
import * as fs from 'fs';
import * as path from 'path';
import { storageDir } from '../utils/storage';
import { FileTransferService } from '../file-transfer/file-transfer.service';
import { PlaceProductNotExistException } from '../exceptions/place-product-not-exist.exception';
import { NameValuesToShortException } from '../exceptions/name-values-to-short.exception';
import { NeedAllValuesException } from '../exceptions/need-all-values.exception';
import { RestoreProductDto } from './dto/restore-product.dto';
import { ProductAmountToLow } from '../exceptions/product-amount-to.low';

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
      .getMany();
  }

  async createNewProduct(
    product: CreateProductDto,
    file: FileTransferInterface,
  ): Promise<ProductCreatedResponse> {
    const { name, price, dateOfBuy, amount } = product;
    const photo = file;
    if (!name || !price || !dateOfBuy || !amount || amount < 1 || price < 0.1) {
      throw new NeedAllValuesException();
    } else if (name.length < 3) {
      throw new NameValuesToShortException();
    }
    try {
      const newProduct = new Products();
      newProduct.name = name;
      newProduct.price = Number(price);
      newProduct.amount = Number(amount);
      newProduct.dateOfBuy = dateOfBuy;
      if (photo) {
        newProduct.img = photo.filename;
      } else {
        newProduct.img = 'default-product-image.jpeg';
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
          const pathTo = path.join(storageDir(), `/${productToUpdate.img}`);
          if (
            productToUpdate.img &&
            productToUpdate.img !== 'default-product-image.jpeg'
          ) {
            fs.unlinkSync(pathTo);
          }
          productToUpdate.img = photo.filename;
        }
        await productToUpdate.save();
        return {
          isSuccess: true,
          message: `product ${name} updated!`,
        };
      } else {
        throw new NameValuesToShortException();
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
      throw new PlaceProductNotExistException();
    }
    if (!isProductAssign && isProductExist) {
      await Products.delete(id);
      const pathTo = path.join(storageDir(), `/${isProductExist.img}`);
      if (
        isProductExist.img &&
        isProductExist.img !== 'default-product-image.jpeg'
      ) {
        fs.unlinkSync(pathTo);
      }
      return {
        isSuccess: true,
        message: 'product has been removed',
      };
    } else if (isProductExist) {
      isProductExist.productStatus = ProductStatus.OUTOFSTOCK;
      await isProductExist.save();
      return {
        isSuccess: false,
        message:
          ' Since your product is already in use delete straight away is not possible! Go to finalized tab and remove this item from all places, then you can delete it from the database. For now, it is marked as out of stock',
      };
    }
  }

  async restoreProduct(product: RestoreProductDto) {
    const { productId, amount } = product;
    if (!productId || !amount) {
      throw new NeedAllValuesException();
    }
    if (amount < 1) {
      throw new ProductAmountToLow();
    }
    const productToRestore = await Products.findOne({
      where: { id: productId },
    });
    if (!productToRestore) {
      throw new PlaceProductNotExistException();
    }
    productToRestore.productStatus = ProductStatus.AVAILABLE;
    productToRestore.amount = amount;
    await productToRestore.save();

    return {
      isSuccess: true,
      message: `product restored!`,
    };
  }

  async setProductUnAvailable(productId: string) {
    if (!productId) {
      throw new NeedAllValuesException();
    }

    const productToMakeUnavailable = await Products.findOne({
      where: { id: productId },
    });
    if (!productToMakeUnavailable) {
      throw new PlaceProductNotExistException();
    }
    productToMakeUnavailable.productStatus = ProductStatus.OUTOFSTOCK;
    await productToMakeUnavailable.save();

    return {
      isSuccess: true,
      message: `Product is now unavailable!`,
    };
  }
}
