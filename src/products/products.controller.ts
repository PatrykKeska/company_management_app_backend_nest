import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { Products } from '../entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCreatedResponse } from './interfaces/product-created-response';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductUpdatedResponse } from './interfaces/product-updated-response';
import { RemoveProductResponse } from './interfaces/remove-product-response';

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
  @Post('/add-new')
  async createNewProduct(
    @Body() product: CreateProductDto,
  ): Promise<ProductCreatedResponse> {
    return this.productsService.createNewProduct(product);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/get-one')
  async getOneProductById(@Body() body): Promise<Products> {
    const { id } = body;
    return this.productsService.getProductByID(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update')
  async updateProductValues(
    @Body() product: UpdateProductDto,
  ): Promise<ProductUpdatedResponse> {
    return this.productsService.updateProduct(product);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove')
  async removeProduct(@Body() body): Promise<RemoveProductResponse> {
    const { id } = body;
    return await this.productsService.removeProduct(id);
  }
}
