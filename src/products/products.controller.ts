import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { Products } from '../entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorage, storageDir } from '../utils/storage';
import { FileTransferInterface } from '../file-transfer/interfaces/multer-disk-uploaded-files';
import * as path from 'path';
import { RestoreProductDto } from './dto/restore-product.dto';
import { SetProductUnavailableDto } from './dto/set-product-unavailable.dto';
import { ProductResponseInterface } from './interfaces/product-response-interface';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAllAvailableProducts(): Promise<Products[]> {
    return await this.productsService.getAllAvailableProducts();
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage(path.join(storageDir(), 'product-photos')),
    }),
  )
  @Post('/add-new')
  async createNewProduct(
    @Body() product: CreateProductDto,
    @UploadedFile() file: FileTransferInterface,
  ): Promise<ProductResponseInterface> {
    return this.productsService.createNewProduct(product, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/get-one')
  async getOneProductById(@Body() body): Promise<Products> {
    const { id } = body;
    return this.productsService.getProductByID(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage(path.join(storageDir(), 'product-photos')),
    }),
  )
  @Patch('/update')
  async updateProductValues(
    @Body() product: UpdateProductDto,
    @UploadedFile() file: FileTransferInterface,
  ): Promise<ProductResponseInterface> {
    return this.productsService.updateProduct(product, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/restore')
  async restoreProduct(
    @Body() product: RestoreProductDto,
  ): Promise<ProductResponseInterface> {
    return this.productsService.restoreProduct(product);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('/unavailable')
  async setUnAvailable(
    @Body() product: SetProductUnavailableDto,
  ): Promise<ProductResponseInterface> {
    return this.productsService.setProductUnAvailable(product.productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove')
  async removeProduct(@Body() body): Promise<ProductResponseInterface> {
    const { id } = body;
    return await this.productsService.removeProduct(id);
  }
}
