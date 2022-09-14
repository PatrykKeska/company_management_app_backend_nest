import { HttpException, HttpStatus } from '@nestjs/common';

export class NotAvailableException extends HttpException {
  constructor() {
    super('No longer Available!', HttpStatus.BAD_REQUEST);
  }
}
