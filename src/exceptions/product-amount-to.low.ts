import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductAmountToLow extends HttpException {
  constructor() {
    super('The  amount of this product is to low', HttpStatus.BAD_REQUEST);
  }
}
