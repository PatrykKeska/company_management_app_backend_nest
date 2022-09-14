import { HttpException, HttpStatus } from '@nestjs/common';

export class NeedAllValuesException extends HttpException {
  constructor() {
    super('All values are needed!', HttpStatus.BAD_REQUEST);
  }
}
